-- Cria a tabela "profiles" e mantém-na sincronizada com auth.users
-- Execute-a UMA vez (pode usar “Run” na aba Scripts ou o console SQL do Supabase)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username varchar(255) unique,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Gatilho: quando um utilizador é criado em auth.users, cria o perfil automaticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.email, null); -- Use email as initial username
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Allow authenticated users to read their own profile
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Allow authenticated users to insert their own profile
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- Allow authenticated users to update their own profile
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);
