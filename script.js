
//const API_KEY= 'a0dbc862a316b5d8e707c7d410abea12';
let input=document.querySelector('input');

//let movieName=input.value; if written here it will take empty '' just as page loads

//Global Array to hold your saved movies
let watchlist = [];


function loadPage(){
  const links=document.querySelectorAll("a");
  links.forEach((link)=>{
    link.addEventListener("click",(event)=>{
      // Prevent the default browser page jumping behavior
        event.preventDefault(); 

        //Hide all page sections first
        const sections=document.querySelectorAll('section');
        sections.forEach((section)=>{
          section.style.display= 'none';
        })

        //Extract the target ID from the clicked anchor link href
        const targetId = link.getAttribute('href'); 
        const targetSection = document.querySelector(targetId);


        //Change the targeted element's display directly
        if (targetSection) {
          targetSection.style.display = 'block'; // Or 'flex', 'grid', etc.
        }
        if(targetId ==='#watchList') //give in ''
        {
            loadWatchList();
        }
    })
  })
}

loadPage();


/*
function loadWatchList()
{
  watchlist.forEach((item)=>{
    const saved=JSON.parse(localStorage.getItem(""));
    console.log(saved);

  })
}
*/

function loadWatchList() {
  // 1. Get the data using the exact key name you saved it with ("watchlist")
  const storedData = localStorage.getItem("watchlist");
  
  // 2. Parse the stringified text back into a real JavaScript array
  // If storage is empty, default it to an empty array [] so it doesn't crash
  const savedMovies = storedData ? JSON.parse(storedData) : [];
  
  //IMP:
  // 3. Target the inner wrapper element on your watchlist page layout
  const watchlistContainer = document.querySelector("#watchList .watchList");
  if (!watchlistContainer) return;

  //IMP:
  // 4. Wipe out any old card elements from previous clicks (leaves <h2> intact)
  const existingCards = watchlistContainer.querySelectorAll(".movieCard");
  existingCards.forEach(card => card.remove());

  // 5. If no movies are saved, show a clean fallback text string
  if (savedMovies.length === 0) {
    let emptyMsg = document.createElement("p");
    emptyMsg.textContent = "Your watchlist is empty.";
    watchlistContainer.appendChild(emptyMsg);
    return;
  }

  // 6. Loop through the actual saved movies array and print cards to the page
  savedMovies.forEach((item) => {
    
    let movieCard = document.createElement("div");
    movieCard.classList.add("movieCard");
    //To apply Flexbox or Grid layouts dynamically using JavaScript, you can manipulate 
    //the .style property of the watchlistContainer element you just targeted.
    //1.Apply Grid dynamically
    watchlistContainer.classList.add('layoutGrid');
    watchlistContainer.style.marginTop='60px';

    let h1 = document.createElement("h1");
    h1.textContent = item.title;

    let img = document.createElement("img");
    if (item.backdrop_path) {
      img.src = `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`;
    }

    let delBtn=document.createElement("button");
    delBtn.classList.add('delBtn');
    delBtn.innerHTML=`<img src="delBtn.webp" alt="delete">`;

    delBtn.addEventListener("click",()=>{
      //localStorage.removeItem("movieCard"); this is wrong since your entire array of watchList will be deleted
        // 1. Remove the physical card from the webpage screen immediately
        movieCard.remove();

        // 2. Pull down your current array of movies from storage
        let currentList = JSON.parse(localStorage.getItem('watchList')) || [];

        // 3. Filter out the specific movie using its unique text title (h1)
        let updatedList = currentList.filter(movie => movie.title !== h1.innerText);

        // 4. Push the cleaned array back down to storage
        localStorage.setItem('myWatchlist', JSON.stringify(updatedList));
    })

    // Append items inside the layout structure tree
    movieCard.appendChild(h1);
    movieCard.appendChild(delBtn);
    movieCard.appendChild(img);
    
    watchlistContainer.appendChild(movieCard);
    //2.Automatically add the grid layout  class defined in css file to the container
    watchlistContainer.classList.add('layoutGrid');
  });
}






async function getMovies(movieName) {
  try {

    const url =`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${movieName}`;

    const options = {
    method: 'GET',
    headers: {
    'accept': 'application/json',  //the format of data the browser wants to receive in response.
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGRiYzg2MmEzMTZiNWQ4ZTcwN2M3ZDQxMGFiZWExMiIsIm5iZiI6MTc4NTQ2MzEwNi41NDQ5OTk4LCJzdWIiOiI2YTZjMDE0MmI3NDI5NjNkYjE2NGRmZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.bLxE1_CIUYUp4R0CIHyrI2gKxVnjON_rZeBQjvE6F58'
    }
   };

    const response = await fetch(url, options);
    const movieData = await response.json();
    console.log(movieData); // This holds the array of matching movies

     let container=document.querySelector(".container");
     container.innerHTML = "";

    //movieData is obj & movieData.results consists of array of size 20 thus loop possible
      movieData.results.forEach((item,idx)=>{
    
    let movieCard=document.createElement("div");
    movieCard.classList.add("movieCard");
    let h1=document.createElement("h1");
    //h1.textContent=movieData.results[idx].title;
    h1.textContent=item.title;
    //movieData.results[idx]=item

     // Create Image
        let img = document.createElement("img");
        if (item.backdrop_path) 
        {
           //https:// for images is a mandatory modern web standard enforced by browsers and APIs, and you cannot bypass it to access assets directly.
           img.src = `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`; //got this from images section in docs
           //img.style.width = "400px";
        }

    let span1=document.createElement("span");
    span1.textContent=`Release: ${item.release_date || 'N/A'}`;

    let span2=document.createElement("span");
     span2.textContent= `Popularity: ${Math.round(item.popularity)}`;
   
    //img.classList.add(`src=${movieData.results[idx].backdrop_path}`); wrong since classList.add() is ONLY for CSS Styles

    let liked=document.createElement("div");
    liked.innerHTML=`&#x2661`;
    liked.classList.add('liked');
      
    liked.addEventListener("click",()=>{
      liked.style.color = '#FFD400'; // Apply yellow color hex styling smoothly
    })

    let saveBtn= document.createElement("button");
    //Wrapp securely inside a string literal
    saveBtn.innerHTML=`<img src="saveIcon.webp" alt="save">`;
    saveBtn.classList.add('saveBtn');


    /*
    saveBtn.addEventListener("click",()=>{
      localStorage.setItem("SavedMovie",item.JSON.stringify());
    })
    */

    saveBtn.addEventListener("click", () => {
  // 1. Check if the movie is already inside your array to prevent duplicates
  if (!watchlist.some(movie => movie.id === item.id)) {
    
    // 2. Push the item into your global memory array
    watchlist.push(item);
    
    // 3. CORRECT FIXED SYNTAX: Pass the variable inside the parenthesis
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    
    // 4. Update the button UI text state
    saveBtn.textContent = "Saved ✓";
  }
});


      container.appendChild(movieCard);
      movieCard.appendChild(h1);
      movieCard.appendChild(img);
      movieCard.appendChild(span1);
      movieCard.appendChild(span2);
      movieCard.appendChild(saveBtn);
      movieCard.appendChild(liked);
      
  })


  } catch (error) {
    console.error('Request failed:', error);
  }
}

let btn=document.querySelector('button');
btn.addEventListener("click",()=>{
  let movieName=input.value.trim();
  getMovies(movieName);
})

input.addEventListener("keydown",(event)=>{
  if(event.key==="Enter")
  {
    let movieName=input.value.trim();
    getMovies(movieName);
  }
})
