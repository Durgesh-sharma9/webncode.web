const ImageKit = require('imagekit');

/**
 * ImageKit instance configuration
 */
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_Di6Q66P/0jdGaa4Vujd4dHfaiDw=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_xdgf01q8MDid+WB8eqmfXyp2IlU=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/2qoga5wjp'
});

module.exports = imagekit;
