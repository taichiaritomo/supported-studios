# Supported Studios

## Prototype

### Hosting
The prototype is currently hosted in Taichi's Vercel account. Please reach out to Taichi if there are any issues! The database is also part of the Vercel account.

### Replacing the globe texture map
The texture maps for the globes are located in the [prototype/public/images/globe](https://github.com/taichiaritomo/supported-studios/tree/main/prototype/public/images/globe) directory. You can simply upload a new image and update the reference to the texture map located [on line 119 of prototype/components/Globe.vue](https://github.com/taichiaritomo/supported-studios/blob/main/prototype/components/Globe.vue#L119).

## Data Prep

The `prep` directory contains the code used for preparing the original dataset. This code is no longer necessary, since the database is managed through the `/kitchen` page.
