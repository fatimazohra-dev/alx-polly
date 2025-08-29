# Supabase Authentication Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Wait for the project to be set up (usually takes 1-2 minutes)

## 2. Get Project Credentials

1. Go to your project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **Project API Key** (anon public key)

## 3. Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/api/auth/callback`

For production, also add your production URLs.

## 5. Set Up User Profiles (Optional)

If you want to store additional user information, create a profiles table:

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 6. Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Try registering a new account
4. Check your email for verification (if email confirmation is enabled)
5. Try logging in

## Features Implemented

✅ **User Registration** - Sign up with email and password
✅ **User Login** - Sign in with email and password  
✅ **Session Management** - Automatic token refresh and persistence
✅ **Protected Routes** - Dashboard and create poll pages require authentication
✅ **User Context** - Access user data throughout the app
✅ **Logout Functionality** - Sign out and clear session
✅ **Route Protection** - Middleware redirects unauthenticated users
✅ **Loading States** - Proper loading and error handling

## Next Steps

1. **Email Verification** - Configure email templates in Supabase
2. **Password Reset** - Add forgot password functionality
3. **User Profiles** - Create profile management pages
4. **Social Login** - Add Google, GitHub, etc. authentication
5. **Role-Based Access** - Implement user roles and permissions

## Troubleshooting

### Common Issues:

1. **"Invalid API key"** - Check your environment variables
2. **"Invalid redirect URL"** - Add your URLs to Supabase auth settings
3. **Email not sending** - Configure SMTP settings in Supabase
4. **CORS errors** - Ensure your domain is listed in Supabase settings

### Debug Authentication:

```javascript
// Add this to any component to debug auth state
const { user, loading } = useAuth()
console.log('Auth state:', { user, loading })
```

## Security Notes

- Environment variables are properly configured for client/server separation
- JWT tokens are automatically managed by Supabase
- Row Level Security (RLS) should be enabled for all tables
- Middleware protects routes before they load
- Session cookies are httpOnly and secure
