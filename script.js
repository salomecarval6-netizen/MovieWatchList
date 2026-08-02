
//const API_KEY= 'a0dbc862a316b5d8e707c7d410abea12';
let input=document.querySelector('input');

//let movieName=input.value; if written here it will take empty '' just as page loads

//Global Array to hold your saved movies
// This checks local storage first. If it finds data, it uses it; otherwise, it falls back to an empty array.
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];


let reviews=JSON.parse(localStorage.getItem("reviews")) ||{};

//Forces the Home section layout to display on initial page load.
document.querySelector('#home').style.display = 'block';


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
          targetSection.style.flexDirection = 'column';
          loadWatchList();
        } 
        else if(targetId==='#about')
        {
          loadReviews();
        }
        else {
          // For Home and About, standard block display works perfectly
          targetSection.style.display = 'block'; 
           
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
    } else if (item.poster_path) {
    img.src = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
    }



    let delBtn=document.createElement("button");
    delBtn.classList.add('delBtn');
    //delBtn.innerHTML=`<img src="delBtn.webp" alt="delete">`; not working
    delBtn.textContent="X";

    delBtn.addEventListener("click",()=>{
      //localStorage.removeItem("movieCard"); this is wrong since your entire array of watchList will be deleted
        // 1. Remove the physical card from the webpage screen immediately
        movieCard.remove();

        // 2. Pull down your current array of movies from storage
        let currentList = JSON.parse(localStorage.getItem('watchlist')) || [];

        // 3. Filter out the specific movie using its unique text title (h1)
        let updatedList = currentList.filter(movie => movie.title !== h1.innerText);

        // 4. Push the cleaned array back down to storage
        localStorage.setItem('watchlist', JSON.stringify(updatedList));

         // 5. Keep runtime memory state synced
        watchlist = updatedList;
        alert(`Note is successfully deleted!`);
        // 6. If you deleted the last item, show the fallback message immediately
        if (updatedList.length === 0) {
             watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
        }
    })


    let review=document.createElement("input");
    review.type = "text";
    review.placeholder = "Write a review...";
  
    review.addEventListener("keydown",(event)=>{
      if(event.key==="Enter")
      {
        let reviewText=review.value.trim();

        if (reviewText) {
        // 2. Map the movie title string dynamically as the unique key identifier property
        reviews[item.title] = reviewText;

        // 3.Convert your object to a string before saving to localStorage
        localStorage.setItem("reviews", JSON.stringify(reviews));

        alert(`Review saved for ${item.title}!`);
        }
      }
    })

    // Append items inside the layout structure tree
    movieCard.appendChild(h1);
    movieCard.appendChild(delBtn);
    movieCard.appendChild(img);
    movieCard.appendChild(review);
    watchlistContainer.appendChild(movieCard);
    //2.Automatically add the grid layout  class defined in css file to the container
    watchlistContainer.classList.add('layoutGrid');

    });
  }




function loadReviews()
{
  const aboutSection = document.querySelector("#about");
  if (!aboutSection) return;

  //If you see the same review rendering twice on the screen after a reload, it is because your code is 
  //appending new elements without clearing out the section's old HTML layout content.

  //Clear out the entire section content before building new cards
  aboutSection.innerHTML = ""; 

  let div=document.createElement("div");
  div.classList.add('container');
  let reviewList=JSON.parse(localStorage.getItem('reviews')) || {};

  //Use Object.entries() to loop through key-value pairs (since Object properties don't have .forEach)
  const reviewPairs = Object.entries(reviewList);

  // Loop through each [movieTitle, reviewText] pair
  //Note the array destructuring brackets 
  reviewPairs.forEach(([movieTitle, reviewText])=>{
    let title=document.createElement("h1");
    title.textContent=movieTitle;

    let review=document.createElement("p");
    review.textContent=reviewText;

    //Pass the element variables, not string literals
    div.appendChild(title); 
    div.appendChild(review);
  })

  //Append the actual DOM node outside the loop, without quotes.
  //Append inside the target active page section container instead of the document body root
  aboutSection.appendChild(div); 

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
      // 1. ALWAYS pull the freshest, most up-to-date data from localStorage first
      let currentStored = JSON.parse(localStorage.getItem("watchlist")) || [];
      
      // 2. Check if the movie is already inside that fresh list to prevent duplicates
      if (!currentStored.some(movie => movie.id === item.id)) {
        
        // 3. Push the new movie into your fresh list
        currentStored.push(item);
        
        // 4. Update BOTH your global memory array and localStorage using the unified key
        watchlist = currentStored;
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        
        // 5. Update the button UI state
        saveBtn.textContent = "Saved ✓";
      } else {
        saveBtn.textContent = "Already Saved";
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
