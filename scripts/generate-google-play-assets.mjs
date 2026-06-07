import sharp from 'sharp';

const assets = [
  {
    source: 'store-assets/google-play/app-icon.svg',
    output: 'store-assets/google-play/app-icon.png',
    width: 512,
    height: 512,
    flatten: false,
  },
  {
    source: 'store-assets/google-play/feature-graphic.svg',
    output: 'store-assets/google-play/feature-graphic.png',
    width: 1024,
    height: 500,
    flatten: true,
  },
];

await Promise.all(assets.map(asset => (
  (asset.flatten
    ? sharp(asset.source, { density: 144 }).flatten({ background: '#172033' })
    : sharp(asset.source, { density: 144 }))
    .resize(asset.width, asset.height)
    .png()
    .toFile(asset.output)
)));

for (const asset of assets) {
  console.log(`${asset.output} ${asset.width}x${asset.height}`);
}
