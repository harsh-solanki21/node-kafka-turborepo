```bash
# To run the project
pnpm run dev  # runs all

pnpm run dev --filter product  # runs product

# To add new package
pnpm -w add -D tailwindcss  # add tailwindcss to root package.json

pnpm --filter product add -D tailwindcss  # add tailwindcss to product package.json
```
