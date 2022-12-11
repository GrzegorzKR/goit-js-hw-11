import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelectorAll('#loadMoreBtn');
const APIKey = '22110110-b4af2cd8f53ff6ca106014951';
const safesearch = true;
const amountPerPage = 40;

let pageNumber = 1;
let leftHits;
let totalHits = 0;

async function fetchFiles(search, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${APIKey}&q=${search}&image_type=photo&orientation=horizontal&safesearch=${safesearch}&page=${page}&per_page=${amountPerPage}`
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}

const searchFiles = () => {
  fetchFiles(input.value, pageNumber)
    .then(photos => {
      if (pageNumber < 1) {
        gallery.innerHTML = '';
      } else if (pageNumber >= 1) {
        loadMoreBtn.classList.remove('is-hidden');
        if (leftHits < 0) {
          loadMoreBtn.classList.add('is-hidden');
          Notiflix.Notify.failure(
            `We're sorry, but you've reached the end of search results.`
          );
        }
      }
      viewFiles(photos);
      pageNumber += 1;
      leftHits = totalHits - pageNumber * 40;
    })
    .catch(error => {
      console.log(error);
    });
};
