const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, responseUtil) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = { title, tags, body, id, createdAt, updatedAt };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = responseUtil.response({
      status: 'success',
      message: 'Note has successfully added',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = responseUtil.response({
    status: 'fail',
    message: 'Failed to add a note',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, responseUtil) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: { note },
    };
  }

  const response = responseUtil.response({
    status: 'fail',
    message: 'Note is not found',
  });

  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, responseUtil) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== 1) {
    notes[index] = { ...notes[index], title, tags, body, updatedAt };
  }

  const response = responseUtil.response({
    status: 'success',
    message: 'Note successfully updated',
  });

  response.code(200);
  return response;
};

const deleteNoteByIdHandler = (request, responseUtil) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = responseUtil.response({
      status: 'success',
      message: 'Note successfully deleted',
    });
    response.code(200);
    return response;
  }

  const response = responseUtil.response({
    status: 'fail',
    message: 'Failed to delete note',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  editNoteByIdHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  deleteNoteByIdHandler,
};
