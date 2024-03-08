const { s3, PutObjectCommand, DeleteObjectCommand } = require('../../utils/bucket_db');

const uploadFile = async (path, buffer, mimetype) => {
  const urlBucket = process.env.BACKBLAZE_BUCKET;
  const urlRegion = process.env.REGION_S3;
  const pathFile = `projects/${new Date().toISOString() + path.toString().replace(' ', '')}`;
  try {
    const file = new PutObjectCommand({
      Bucket: urlBucket,
      Key: pathFile,
      Body: buffer,
      ContentType: mimetype,
    });
    await s3.send(file);

    const urlFile = `https://${urlBucket}.s3.${urlRegion}.${process.env.URL_S3}/${pathFile}`;

    return urlFile;
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    throw error;
  }
};

const deleteFile = async (path) => {
  try {
    const deleteThisFile = new DeleteObjectCommand({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: path,
    });
    await s3.send(deleteThisFile);
  } catch (erro) {
    console.log(`Erro ao deletar imagem do banco de dados: ${erro.message}`);
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
