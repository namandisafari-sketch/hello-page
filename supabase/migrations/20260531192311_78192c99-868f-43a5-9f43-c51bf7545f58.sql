
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'client');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.agreement_status AS ENUM ('draft', 'sent', 'signed', 'expired');
CREATE TYPE public.project_status AS ENUM ('planned', 'in_progress', 'on_hold', 'delivered', 'cancelled');

-- =========================================
-- updated_at helper
-- =========================================
CREATE OR REPLACE FUNCTION public.tu_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- USER ROLES (separate table — security)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','staff')
  );
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- Signup trigger -> profile + default client role
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- CLIENTS
-- =========================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  plan TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage clients" ON public.clients
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Client reads own record" ON public.clients
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- AGREEMENTS
-- =========================================
CREATE TABLE public.agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  status public.agreement_status NOT NULL DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agreements TO authenticated;
GRANT ALL ON public.agreements TO service_role;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage agreements" ON public.agreements
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Client reads own agreements" ON public.agreements
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.user_id = auth.uid())
  );

CREATE TRIGGER trg_agreements_updated BEFORE UPDATE ON public.agreements
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- INVOICES
-- =========================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  number TEXT,
  description TEXT NOT NULL,
  amount_ugx BIGINT NOT NULL CHECK (amount_ugx >= 0),
  due_date DATE,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage invoices" ON public.invoices
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Client reads own invoices" ON public.invoices
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.user_id = auth.uid())
  );

CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- RECEIPTS
-- =========================================
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount_ugx BIGINT NOT NULL CHECK (amount_ugx >= 0),
  method TEXT,
  reference TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts TO authenticated;
GRANT ALL ON public.receipts TO service_role;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage receipts" ON public.receipts
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Client reads own receipts" ON public.receipts
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.user_id = auth.uid())
  );

CREATE TRIGGER trg_receipts_updated BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- WORKER PAYMENTS
-- =========================================
CREATE TABLE public.worker_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_name TEXT NOT NULL,
  description TEXT,
  amount_ugx BIGINT NOT NULL CHECK (amount_ugx >= 0),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_payments TO authenticated;
GRANT ALL ON public.worker_payments TO service_role;
ALTER TABLE public.worker_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage worker payments" ON public.worker_payments
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- =========================================
-- HR STAFF (Uganda payroll fields)
-- =========================================
CREATE TABLE public.hr_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  gross_pay_ugx BIGINT NOT NULL DEFAULT 0 CHECK (gross_pay_ugx >= 0),
  nssf_ugx BIGINT NOT NULL DEFAULT 0,
  paye_ugx BIGINT NOT NULL DEFAULT 0,
  lst_ugx BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_staff TO authenticated;
GRANT ALL ON public.hr_staff TO service_role;
ALTER TABLE public.hr_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage hr_staff" ON public.hr_staff
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE TRIGGER trg_hr_staff_updated BEFORE UPDATE ON public.hr_staff
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- PROJECTS
-- =========================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status public.project_status NOT NULL DEFAULT 'planned',
  started_at DATE,
  due_at DATE,
  notes TEXT,
  is_showcase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads showcase projects" ON public.projects
  FOR SELECT USING (is_showcase = true);
CREATE POLICY "Staff manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Client reads own projects" ON public.projects
  FOR SELECT TO authenticated USING (
    client_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.user_id = auth.uid()
    )
  );

CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- SCHOOLPAY SCHOOLS
-- =========================================
CREATE TABLE public.schoolpay_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  gate_access_enabled BOOLEAN NOT NULL DEFAULT false,
  smart_cards_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schoolpay_schools TO authenticated;
GRANT ALL ON public.schoolpay_schools TO service_role;
ALTER TABLE public.schoolpay_schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage schoolpay_schools" ON public.schoolpay_schools
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE TRIGGER trg_schoolpay_schools_updated BEFORE UPDATE ON public.schoolpay_schools
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();

-- =========================================
-- SCHOOLPAY EVENTS (webhook log)
-- =========================================
CREATE TABLE public.schoolpay_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schoolpay_schools(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  student_ref TEXT,
  amount_ugx BIGINT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schoolpay_events TO authenticated;
GRANT ALL ON public.schoolpay_events TO service_role;
ALTER TABLE public.schoolpay_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read schoolpay_events" ON public.schoolpay_events
  FOR SELECT TO authenticated USING (public.is_staff_or_admin(auth.uid()));

-- =========================================
-- CMS CONTENT (publicly readable)
-- =========================================
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_content TO authenticated;
GRANT ALL ON public.cms_content TO service_role;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads cms" ON public.cms_content
  FOR SELECT USING (true);
CREATE POLICY "Staff manage cms" ON public.cms_content
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE TRIGGER trg_cms_updated BEFORE UPDATE ON public.cms_content
  FOR EACH ROW EXECUTE FUNCTION public.tu_set_updated_at();
