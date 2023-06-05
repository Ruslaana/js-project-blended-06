import * as basicLightbox from 'basiclightbox';
import { getMovieVideos } from './API/get-from-server.js';
import { errorTrailerMarkup } from './errortrailer.js';

const trailerBtn = document.getElementById('trailer-btn');
const id = 667538;
trailerBtn.addEventListener('click', () => {
  getTrailer(id);
});

async function getDataVideo(id) {
  try {
    const data = await getMovieVideos(id);
    return data.results;
  } catch (err) {
    console.log(err);
  }
}
export async function getTrailer(id) {
  try {
    const videos = await getDataVideo(id);
    const myKey = videos.find(el => el.key)?.key;
    const instance = createLightboxWithEvents(succesTrailerMarkup(myKey));
    instance.show(() => console.log('lightbox now visible'));
  } catch (error) {
    const instance = createLightboxWithEvents(errorTrailerMarkup());
    instance.show(() => console.log('lightbox now visible'));
    instance.element().addEventListener('click', closeModalOnBtn);
  }

  function createLightboxWithEvents(content) {
    const instance = basicLightbox.create(content, {
      onShow: instance => {
        window.addEventListener('keydown', closeModalOnEsc);
      },
      onClose: instance => {
        window.removeEventListener('keydown', closeModalOnEsc);
      },
    });

    window.addEventListener('keydown', closeModalOnEsc);

    return instance;
  }

  function closeModalOnEsc(event) {
    if (event.code === 'Escape') {
      const instance = basicLightbox.get();
      if (instance) {
        instance.close();
      }
    }
  }

  function closeModalOnBtn(event) {
    const target = event.target;
    if (target.classList.contains('select-icon') || target.closest('.icon')) {
      const instance = basicLightbox.get();
      if (instance) {
        instance.close();
      }
    }
  }
}

function succesTrailerMarkup(myKey) {
  return `
<iframe class="iframe" src="https://www.youtube.com/embed/${myKey}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
}
