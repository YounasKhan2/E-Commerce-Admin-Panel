# Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is ready.

## ✅ Code Quality

- [ ] All features are working locally
- [ ] No console errors in browser DevTools
- [ ] All TypeScript/ESLint errors are resolved
- [ ] Code is properly formatted
- [ ] Unused imports are removed
- [ ] Console.log statements are removed (or kept intentionally)

## ✅ Environment Configuration

- [ ] `.env.local` file exists with all required variables
- [ ] `.env.example` file is created and up-to-date
- [ ] All `NEXT_PUBLIC_*` variables are documented
- [ ] No sensitive data in `.env.example`
- [ ] `.env*` is in `.gitignore` (except `.env.example`)

## ✅ Appwrite Backend

- [ ] Appwrite project is created
- [ ] Database `ecommerce_main` is created
- [ ] All collections are created:
  - [ ] categories
  - [ ] products
  - [ ] product_variants
  - [ ] customers
  - [ ] orders
  - [ ] order_items
  - [ ] alerts
  - [ ] support_tickets
  - [ ] ticket_messages
  - [ ] customer_segments
- [ ] Storage buckets are created:
  - [ ] product-images
  - [ ] invoices
  - [ ] documents
- [ ] Functions are deployed (if applicable):
  - [ ] generateInvoice
  - [ ] processOrder
  - [ ] calculateAnalytics
- [ ] Permissions are properly configured
- [ ] Test data is added (optional)

## ✅ Assets and Icons

- [ ] `public/favicon.svg` exists
- [ ] `app/icon.svg` exists
- [ ] `app/apple-icon.svg` exists
- [ ] `public/manifest.json` exists
- [ ] `public/robots.txt` exists
- [ ] All images are optimized
- [ ] No broken image links

## ✅ Metadata and SEO

- [ ] Page titles are set correctly
- [ ] Meta descriptions are added
- [ ] Open Graph tags are configured
- [ ] Twitter card tags are configured
- [ ] Favicon is displaying correctly
- [ ] robots.txt prevents indexing (for admin panel)

## ✅ Performance

- [ ] Build completes successfully: `npm run build`
- [ ] No build warnings (or documented)
- [ ] Bundle size is reasonable
- [ ] Images use Next.js Image component
- [ ] Lazy loading is implemented where needed
- [ ] No memory leaks in components

## ✅ Security

- [ ] Authentication is working
- [ ] Protected routes are secured
- [ ] API keys are in environment variables
- [ ] No sensitive data in client-side code
- [ ] CORS is configured in Appwrite
- [ ] Security headers are configured (`vercel.json`)
- [ ] Input validation is implemented
- [ ] XSS protection is in place

## ✅ Responsive Design

- [ ] Mobile layout works (< 640px)
- [ ] Tablet layout works (640px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Touch targets are 44x44px minimum
- [ ] Forms are usable on mobile

## ✅ Browser Compatibility

- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on Edge
- [ ] Tested on mobile browsers

## ✅ Functionality Testing

- [ ] Login/logout works
- [ ] Navigation works
- [ ] Product CRUD operations work
- [ ] Order management works
- [ ] Customer management works
- [ ] Analytics display correctly
- [ ] Search and filters work
- [ ] Image uploads work
- [ ] Forms validate correctly
- [ ] Error handling works

## ✅ Git Repository

- [ ] All changes are committed
- [ ] Commit messages are clear
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] `.gitignore` is properly configured
- [ ] Repository is pushed to remote

## ✅ Documentation

- [ ] README.md is complete
- [ ] DEPLOYMENT.md exists
- [ ] Environment variables are documented
- [ ] API integration is documented
- [ ] Known issues are documented

## ✅ Vercel Configuration

- [ ] `vercel.json` exists
- [ ] Build command is correct
- [ ] Output directory is correct
- [ ] Environment variables are ready to add
- [ ] Custom domain is ready (if applicable)

## ✅ Post-Deployment Plan

- [ ] Monitoring strategy is defined
- [ ] Backup strategy is defined
- [ ] Rollback plan is documented
- [ ] Team members have access
- [ ] Support contacts are documented

## Final Checks

Before clicking "Deploy":

1. **Run Local Build**
   ```bash
   npm run build
   npm start
   ```
   Test the production build locally

2. **Check Environment Variables**
   - Verify all variables are correct
   - Test with production Appwrite project

3. **Review Deployment Settings**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Verify CORS Settings**
   - Add Vercel domain to Appwrite platforms
   - Test API calls will work

## Deployment Day

1. [ ] Deploy to Vercel
2. [ ] Wait for build to complete
3. [ ] Test deployed application
4. [ ] Configure custom domain (if applicable)
5. [ ] Update Appwrite CORS with production URL
6. [ ] Test all features on production
7. [ ] Monitor for errors
8. [ ] Celebrate! 🎉

## Rollback Plan

If something goes wrong:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Check Appwrite CORS settings
5. Roll back to previous deployment if needed

## Support Resources

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Appwrite Discord**: [appwrite.io/discord](https://appwrite.io/discord)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to Deploy?** Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide!
