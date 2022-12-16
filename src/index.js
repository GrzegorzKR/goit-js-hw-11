import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const btnSearch = document.querySelector('.search-btn');
const btnLoadMore = document.querySelector('.loaderBtn');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('input');

const APIkey = '22110110-b4af2cd8f53ff6ca106014951';
const safeSearch = true;
const amountPerPage = 40;
const orientation = 'horizontal';
const image_type = 'photo';

let pageNumber = 1;
let totalHits = 0;
let leftHits;

async function fetchData(search, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${APIkey}&q=${search}&image_type=${image_type}&orientation=${orientation}&safesearch=${safeSearch}&page=${page}&per_page=${amountPerPage}`
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}

const searchImages = () => {
  fetchData(input.value, pageNumber)
    .then(images => {
      if (pageNumber < 1) {
        gallery.innerHTML = '';
      } else if (pageNumber >= 1) {
        btnLoadMore.classList.remove('is-hidden');
        if (leftHits < 0) {
          btnLoadMore.classList.add('is-hidden');
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
      }
      renderGallery(images);
      pageNumber += 1;
      leftHits = totalHits - pageNumber * 40;
    })
    .catch(error => {
      console.log(error);
    });
};

function renderGallery(images) {
  totalHits = images.totalHits;
  if (pageNumber <= 1) {
    leftHits = totalHits;
    if (totalHits <= 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Plese try again.`
      );
      btnLoadMore.classList.toggle('is-hidden');
    } else {
      Notiflix.Notify.success(`Found ${images.totalHits} images`);
    }
  }
  images.hits.forEach(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      gallery.innerHTML += `<div class="photo-card">
                <a class="photo-card__item" href="${largeImageURL}">
                    <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
                <div class="info">
                    <p class="info-item">
                        <b class="info-item__descriptions">Likes
                        <span class="info-item__count">${likes}</span>
                        </b>
                    </p>
                    <p class="info-item">
                        <b class="info-item__descriptions">Views
                        <span class="info-item__count">${views}</span>
                        </b>
                    </p>
                    <p class="info-item">
                        <b class="info-item__descriptions">Comments
                        <span class="info-item__count">${comments}</span>
                        </b>
                    </p>
                    <p class="info-item">
                        <b class="info-item__descriptions">Downloads
                        <span class="info-item__count">${downloads}</span>
                        </b>
                    </p>
                </div>
            </div>`;
    }
  );
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
  });
}

const firstSearchImages = event => {
  event.preventDefault();
  pageNumber = 1;
  gallery.innerHTML = '';
  searchImages();
};

const searchMoreImages = event => {
  event.preventDefault();
  searchImages();
};

btnSearch.addEventListener('click', firstSearchImages);
btnLoadMore.addEventListener('click', searchMoreImages);
