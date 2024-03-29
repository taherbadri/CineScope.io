const global = {
	currentPage: window.location.pathname,
	API: {
		API_KEY: "3901dc55c571b8f2ddd2866c9664988f",
		API_URL: "https://api.themoviedb.org/3/",
	},
	search: {
		term: "",
		type: "",
		page: 1,
		totalPages: 1,
		totalResults: 0,
	},
};

// this function is made to fetch data from TMDB
const fetchData = async (end) => {
	const response =
		await fetch(`${global.API.API_URL}${end}?api_key=${global.API.API_KEY}
	`);
	const data = await response.json();
	return data;
};

// data searching fn
const searchData = async () => {
	const response = await fetch(
		`${global.API.API_URL}search/${global.search.type}?api_key=${global.API.API_KEY}&query=${global.search.term}&page=${global.search.page}`
	);
	// const response =
	// 	await fetch(`${global.API.API_URL}search/${global.search.type}?api_key=${global.API.API_KEY}&query=${global.search.term}&page=${global.search.page}&include_adult=true
	// `);
	const data = await response.json();
	return data;
};

// loder
const loadingStart = () => {
	document.querySelector(".spinner").classList.add("show");
};
const loadingEnd = () => {
	document.querySelector(".spinner").classList.remove("show");
};

// alert functionality
const alertUser = (className) => {
	const input = document.querySelector(".form-control");
	input.style.transition = "all 0.5s";
	input.classList.add(className);

	setTimeout(() => {
		input.classList.remove(className);
	}, 3000);
};

// search functionality
const search = async () => {
	const query = window.location.search;
	const urlParams = new URLSearchParams(query);
	global.search.type = urlParams.get("type");
	global.search.term = urlParams.get("search-term");

	if (global.search.term !== "" && global.search.term !== null) {
		// make request and display result
		alertUser("border-success");
		const { results, total_pages, total_results, page } = await searchData();
		global.search.page = page;
		global.search.totalPages = total_pages;
		global.search.totalResults = total_results;

		if (Array.from(results).length === 0) {
			const firstRow = document.querySelector(".first-row");
			firstRow.innerHTML = `<h1 class="text-center">No Results Found</h1>`;
			firstRow.classList.toggle("text-danger");
			alertUser("border-danger");
		}
		searchResults(results);
	} else {
		alertUser("border-danger");
	}
};

// display search results
const searchResults = async (results) => {
	loadingStart();
	const firstRow = document.querySelector(".first-row");
	const resultCount = document.querySelector(".result-count");
	firstRow.innerHTML = "";

	await results;

	if (global.search.type === "movie") {
		results.forEach((movie) => {
			resultCount.innerHTML = `Found ${global.search.totalResults} results for ${global.search.term}`;
			firstRow.innerHTML += `<div class="card col-sm-12 col-lg-3 col-md-6 pt-2">
        <a href="./movie-detail.html?id=${movie.id}" target="_blank">
        ${
					movie.poster_path
						? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt class="card-img">`
						: `<img src="./images/no-image.jpg" alt
        class="card-img">`
				}
        </a>
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="crad-text">Release Date : ${movie.release_date}</p>
        </div>`;
		});
	} else if (global.search.type === "tv") {
		resultCount.innerHTML = `Found ${global.search.totalResults} results for ${global.search.term}`;
		const firstRow = document.querySelector(".first-row");
		results.forEach((show) => {
			firstRow.innerHTML += `<div class="card col-sm-12 col-md-6 col-lg-3 pt-2">
        <a href="./show-detail.html?id=${show.id}" target="_blank">
        ${
					show.poster_path
						? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt class="card-img">`
						: `<img src="./images/no-image.jpg" alt
        class="card-img">`
				}
        </a>
        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="crad-text">First Air Date : ${show.first_air_date}</p>
        </div>`;
		});
	}
	pagination();
	loadingEnd();
};

// pgination functionality
const pagination = () => {
	const prev = document.getElementById("prev");
	const next = document.getElementById("next");
	const pageNumber = document.querySelector(".page-number");
	pageNumber.innerHTML = `Page ${global.search.page} of ${global.search.totalPages}`;

	global.search.page === global.search.totalPages
		? next.classList.add("disabled")
		: prev.classList.remove("disabled");

	global.search.page === 1
		? prev.classList.add("disabled")
		: prev.classList.remove("disabled");
};

const increment = () => {
	document.getElementById("prev").addEventListener("click", async () => {
		global.search.page--;
		const { results, total_pages } = await searchData();
		searchResults(results);
	});
	document.getElementById("next").addEventListener("click", async () => {
		global.search.page++;
		const { results, total_pages } = await searchData();

		searchResults(results);
	});
};

// swiper
const swiper = async (end) => {
	const wrapper = document.querySelector(".swiper-wrapper");
	const { results } = await fetchData(end);
	if (end === "movie/upcoming") {
		results.forEach((movie) => {
			wrapper.innerHTML += `<div class="swiper-slide">
			<a href="./movie-detail.html?id=${movie.id}">
				<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
				movie.title
			}"
					class="img-fluid"></a>
			<h4 class="swiper-rating"><span
					class="fa-brands fa-imdb text-warning me-2"></span>
				${movie.vote_average.toFixed(1)} / 10</h4>`;
		});
	} else {
		results.forEach((show) => {
			wrapper.innerHTML += `<div class="swiper-slide">
			<a href="./show-detail.html?id=${show.id}">
				<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}"
					class="img-fluid"></a>
			<h4 class="swiper-rating"><span
					class="fa-brands fa-imdb text-warning me-2"></span>
				${show.vote_average.toFixed(1)} / 10</h4>`;
		});
	}

	swiperInit();
};

function swiperInit() {
	const swiper = new Swiper(".swiper", {
		slidesPerView: 1,
		spaceBetween: 20,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 2000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
}
// popular movies fn
const popularMovies = async () => {
	loadingStart();
	const { results } = await fetchData("movie/popular");
	loadingEnd();
	const firstRow = document.querySelector(".first-row");
	results.forEach((movie) => {
		firstRow.innerHTML += `<div class="card col-sm-12 col-lg-3 col-md-6 pt-2">
        <a href="./movie-detail.html?id=${movie.id}">
        ${
					movie.poster_path
						? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt class="card-img">`
						: `<img src="./images/no-image.jpg" alt
        class="card-img">`
				}
        </a>
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="crad-text">Release Date : ${movie.release_date}</p>
        </div>`;
	});
};

const popularShows = async () => {
	loadingStart();
	const { results } = await fetchData("tv/popular");
	loadingEnd();
	const firstRow = document.querySelector(".first-row");
	results.forEach((show) => {
		firstRow.innerHTML += `<div class="card col-sm-12 col-md-6 col-lg-3 pt-2">
        <a href="./show-detail.html?id=${show.id}">
        ${
					show.poster_path
						? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt class="card-img">`
						: `<img src="./images/no-image.jpg" alt
        class="card-img">`
				}
        </a>
        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="crad-text">First Air Date : ${show.first_air_date}</p>
        </div>`;
	});
};

const addCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// movie setail function
const movieDetail = async () => {
	loadingStart();
	const movieId = window.location.search.split("=")[1];
	const movie = await fetchData(`movie/${movieId}`);
	const movie_detail = document.querySelector(".movie-details");
	const movie_info = document.querySelector(".movie-info");
	const backdrop = document.createElement("div");
	backdrop.className = "backdrop rounded";
	backdrop.style.backgroundImage = `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}") `;
	loadingEnd();
	movie_detail.innerHTML = ` <div
	class="col-md-6 col-lg-4 d-flex align-items-center justify-content-center">${
		movie.poster_path
			? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt class="img-fluid rounded my-sm-3 my-md-5 ">`
			: `<img src="./images/no-image.jpg" alt
			class="img-fluid rounded my-sm-3 my-md-5">`
	}</div>
<div
	class="container col-md-6 col-lg-8 d-flex flex-column justify-content-center mt-5">
	<h3 class="text-center">${
		movie.title
	}<br><small class="mt-2 d-inline-block" style="font-family: cursive;">${
		movie.tagline
	}</small></h3>
	<p class="mt-3 text-white"><a href="https://www.imdb.com/title/${
		movie.imdb_id
	}" target="_blank" class =" text-decoration-none" title="${
		movie.title
	} IMDB"> <span class="fa-brands fa-imdb text-warning me-2"></span></a> ${movie.vote_average.toFixed(
		1
	)} / 10</p>
	<p class="mt-3">Release Date : ${movie.release_date}</p>
	<p class="mt-3">${movie.overview}</p>
	<p class="fw-bold fs-5">Genres : </p>
${movie.genres.map((genre) => `<p class="my-0">${genre.name}</p>`).join("")}
 	<a href="${movie.homepage}" target="_blank"
		class="btn btn-outline-warning col-md-9 col-lg-3 mt-3">Visit
		Movie
		Homepage</a>
</div>`;
	movie_info.innerHTML = `<ul class="list-group mb-5 vstack gap-2">
	<h3 class="text-center">Movie Info</h3>
	${
		movie.budget === 0
			? ""
			: `<li
	class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
		class="text-warning">Budget: </span> $${addCommas(movie.budget)}</li>`
	}
	${
		movie.revenue === 0
			? ""
			: `<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Revenue: </span>$${addCommas(movie.revenue)}</li>`
	}
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Runtime: </span> ${movie.runtime} minutes</li>
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Language: </span> ${
				movie.spoken_languages[0].english_name
			}</li>
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Status: </span> ${movie.status}</li>
	<li
		class="list-group-item border-0 text-bg-dark"><h5>Production
			Companies </h5> ${movie.production_companies
				.map(
					(company) =>
						// `<img class = "img-fluid" src="https://image.tmdb.org/t/p/w200${company.name}"`
						company.name + "<br>"
				)
				.join("")}</li>
</ul>`;
	movie_detail.appendChild(backdrop);
};

// show detail function
const showDetail = async () => {
	loadingStart();

	const showId = window.location.search.split("=")[1];
	const show = await fetchData(`tv/${showId}`);
	const show_detail = document.querySelector(".show-details");
	const show_info = document.querySelector(".show-info");
	const backdrop = document.createElement("div");
	backdrop.className = "backdrop rounded";
	backdrop.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${show.backdrop_path}")`;
	loadingEnd();
	show_detail.innerHTML = ` <div
	class="col-md-6 col-lg-4 d-flex align-items-center justify-content-center">${
		show.poster_path
			? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt class="img-fluid rounded my-sm-3 my-md-5 ">`
			: `<img src="./images/no-image.jpg" alt
			class="img-fluid rounded my-sm-3 my-md-5">`
	}</div>
<div
	class="container col-md-6 col-lg-8 d-flex flex-column justify-content-center mt-5">
	<h3 class="text-center">${
		show.name
	}<br><small class="mt-2 d-inline-block" style="font-family: cursive;">${
		show.tagline
	}</small></h3>
	<p class="mt-3 text-white"><a href="https://www.imdb.com/title/${
		show.imdb_id
	}" target="_blank" class =" text-decoration-none" title="${
		show.name
	} IMDB"> <span class="fa-brands fa-imdb text-warning me-2"></span></a> ${show.vote_average.toFixed(
		1
	)} / 10</p>
	<p class="mt-3">Last Episode : ${show.first_air_date}</p>
	<p class="mt-3">${show.overview}</p>
	<p class="fw-bold fs-5">Genres : </p>
${show.genres.map((genre) => `<p class="my-0">${genre.name}</p>`).join("")}
 	<a href="${show.homepage}" target="_blank"
		class="btn btn-outline-warning col-md-9 col-lg-3 mt-3">Visit
		Show
		Homepage</a>
</div>`;
	show_info.innerHTML = `<ul class="list-group mb-5 vstack gap-2">
	<h3 class="text-center">Show Info</h3>
	${
		Array.from(show.episode_run_time).length === 0
			? ""
			: `<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Episode Run Time: </span> ${
				Array.from(show.episode_run_time)[0]
			} minutes</li>`
	}
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Number of Seasons: </span> ${show.number_of_seasons}</li>
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Number of Episodes: </span> ${show.number_of_episodes}</li>
			<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Language: </span> ${
				show.spoken_languages[0].english_name
			}</li>
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Last Episode To Air: </span>Season ${
				show.last_episode_to_air.season_number
			} ${`"${show.last_episode_to_air.name}"`} on ${
		show.last_episode_to_air.air_date
	}</li>
	${
		show.next_episode_to_air === null
			? ""
			: `<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Next Episode To Air: </span>Season ${
				show.next_episode_to_air.season_number
			} ${`"${show.last_episode_to_air.name}"`} on ${
					show.next_episode_to_air.air_date
			  }</li>`
	}
	<li
		class="list-group-item border-0 border-bottom border-secondary text-bg-dark"><span
			class="text-warning">Status: </span> ${show.status}</li>
	<li class="list-group-item border-0 text-bg-dark">
		<h5>Production
			Companies </h5> ${show.production_companies
				.map((company) => company.name + "<br>")
				.join("")}
	</li>
</ul>`;
	show_detail.appendChild(backdrop);
};

// this fn is used to higlight the current page tab
const highlight = () => {
	const links = document.querySelectorAll(".nav-link");
	links.forEach((link) => {
		if ("." + global.currentPage === link.getAttribute("href")) {
			link.classList.add("text-warning");
			link.classList.add("fw-bold");
		}
	});
};

//  this fn is to check which page is currently live
const page = (e) => {
	console.log(global.currentPage);
	switch (global.currentPage) {
		case "/CineScope.io/":
		case "/CineScope.io/index.html":
		case "/":
		case "/index.html":
			swiper("movie/upcoming");
			popularMovies();
			console.log("Home");
			break;
		case "/CineScope.io/shows.html":
		case "/shows.html":
			swiper("tv/airing_today");
			popularShows();
			console.log("Shows");
			break;
		case "/CineScope.io/movie-detail.html":
		case "/movie-detail.html":
			movieDetail();
			console.log("Movie Detail");
			break;
		case "/CineScope.io/show-detail.html":
		case "/show-detail.html":
			showDetail();
			console.log("Show Detail");
			break;
		case "/CineScope.io/search-page.html":
		case "/search-page.html":
			search();
			increment();
			console.log("Search Page");
			break;

		default:
			console.log("Index or Home");
			break;
	}
	highlight();
};

document.addEventListener("DOMContentLoaded", page);
