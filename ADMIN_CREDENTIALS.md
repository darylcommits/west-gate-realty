# Admin Access & Authentication

## Admin Login Credentials

The admin panel uses hardcoded credentials (not Supabase authentication):

- **Email:** `admin@westgaterealty.com`
- **Password:** `admin123`

## How to Access Admin Panel

1. Start your React app: `npm start`
2. Navigate to: `http://localhost:3000/admin`
3. Enter the credentials above
4. You'll be redirected to the admin dashboard

## Supabase Policies (No Auth Required)

Since the admin uses localStorage authentication (not Supabase Auth), use these simplified policies:

```sql
-- Enable Row Level Security
ALTER TABLE residential_properties ENABLE ROW LEVEL SECURITY;

-- Allow public to read (anyone can view properties on the website)
CREATE POLICY "Public can view properties" ON residential_properties
  FOR SELECT USING (true);

-- Allow all insert/update/delete operations (since we're using client-side auth)
CREATE POLICY "Allow all modifications" ON residential_properties
  FOR ALL USING (true);
```

### For Storage (Images):

```sql
-- Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow all to upload/modify (client-side auth protection)
CREATE POLICY "Allow image uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow image updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images');

CREATE POLICY "Allow image deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images');
```

## Security Considerations

### Current Setup (Development):
- ✅ Simple to use
- ✅ No Supabase Auth setup needed
- ⚠️ Admin credentials are in code
- ⚠️ Anyone can modify data if they know how

### Recommendations for Production:

1. **Change Admin Credentials:**
   - Edit [AdminLogin.tsx:28](../west-gate-realty/src/components/admin/AdminLogin.tsx#L28)
   - Use strong password
   - Consider environment variables

2. **Add Supabase Authentication (Optional but Recommended):**
   ```typescript
   // Replace hardcoded check with Supabase Auth
   const { data, error } = await supabase.auth.signInWithPassword({
     email: data.email,
     password: data.password,
   });
   ```

3. **Tighten RLS Policies:**
   ```sql
   -- Only allow authenticated users to modify
   CREATE POLICY "Authenticated can modify" ON residential_properties
     FOR ALL USING (auth.role() = 'authenticated');
   ```

4. **Add API Rate Limiting**
5. **Use HTTPS only**
6. **Add CAPTCHA to login**

## How to Change Admin Password

1. Open `src/components/admin/AdminLogin.tsx`
2. Find line 28
3. Change the password:
   ```typescript
   if (data.email === 'admin@westgaterealty.com' && data.password === 'YOUR_NEW_PASSWORD') {
   ```
4. Save and restart dev server

## Troubleshooting

### "Error loading properties" or "Insert failed"
- Make sure you ran the Supabase policies above
- Check that policies use `USING (true)` (not `auth.role()`)
- Verify your Supabase credentials in `.env`

### Can't login to admin
- Use exact credentials (case-sensitive)
- Check browser console for errors
- Clear localStorage: `localStorage.clear()` in browser console

### Properties not saving
- Check Supabase table exists: `residential_properties`
- Verify storage bucket exists: `property-images`
- Check browser console for specific error messages
