const knex = require('../utils/conection_db');
const { uploadFile, deleteFile } = require('../database/Repositorie/bucketRepositorie');

const postProject = async (req, res) => {
  const { title, description, url } = req.body;

  try {
    let image;

    if (req.file) {
      try {
        const result = await uploadFile(`${req.file.originalname}`, req.file.buffer, req.file.mimetype);
        image = result;
      } catch (uploadError) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor durante o upload da imagem.' });
      }
    }
    const projectDb = await knex('projects').insert({ title, description, url, image }).returning('*');

    if (!projectDb || projectDb.length === 0) {
      return res.status(400).json('O projeto não foi cadastrado.');
    }

    return res.status(201).json(projectDb[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

const putProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;

  try {
    const projectExist = await knex('projects').where({ id }).first();

    if (!projectExist) {
      return res.status(404).json({ mensagem: 'Projeto não encontrado!' });
    }

    let image = projectExist.image;

    if (req.file) {
      try {
        await deleteFile(image);
        const result = await uploadFile(`${req.file.originalname}`, req.file.buffer, req.file.mimetype);
        image = result;
      } catch (uploadError) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor durante o upload da imagem.' });
      }
    }
    const projectDb = await knex('projects').where({ id }).update({ title, description, url, image }).returning('*');

    if (!projectDb || projectDb.length === 0) {
      return res.status(400).json('O projeto não foi cadastrado.');
    }

    return res.status(200).json(projectDb[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await knex('projects').select('*');

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const projectExist = await knex('projects').where({ id }).first();

    if (!projectExist) {
      return res.status(404).json({ mensagem: 'Projeto não encontrado!' });
    }

    await knex('projects').delete('*').where({ id });
    const image = projectExist.image;
    await deleteFile(image);
    return res.status(200).json({ mensagem: 'Projeto excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

module.exports = {
  postProject,
  putProject,
  getProjects,
  deleteProject,
};
