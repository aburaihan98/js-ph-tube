const buttonContainer = document.getElementById("buttonContainer");

// categories section
async function categories() {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/categories"
    );
    const data = await res.json();

    for (const obj of data.categories) {
      const button = document.createElement("button");
      button.onclick = () => {
        sorts(obj?.category_id);
      };
      button.className = `btn active-btn btn-${obj?.category_id}`;
      button.textContent = obj.category;
      buttonContainer.appendChild(button);
    }
  } catch (error) {
    console.log(error);
  }
}
categories();

// video section
const loadVideos = (input = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${input}`
  )
    .then((res) => res.json())
    .then((data) => displayVideo(data.videos))
    .catch((err) => console.log(err));
};

// remove active function
function removeActiveClass() {
  const activeBtn = document.querySelectorAll(".active-btn");
  for (let item of activeBtn) {
    item.classList.remove("bg-[#FF1F3D]");
  }
}

// sort section
const sorts = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => displayVideo(data?.category))
    .catch((err) => console.log(err));

  // removeActiveClass
  removeActiveClass();
  // addActiveClass
  const activeBtn = document.querySelector(`.btn-${id}`);
  activeBtn.classList.add("btn", "bg-[#FF1F3D]");
};

// details function
async function detailsFun(id) {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${id}`
  );
  const data = await res.json();
  displayDetails(data);
}

// display detailsF
function displayDetails(data) {
  console.log(data);

  const modal = document.getElementById("my_modal_1");
  const modalBox = document.getElementById("modal-box");
  modal.showModal();
  const modalText = `
                  <div>
                  <img class="mb-3" src=${data?.video?.thumbnail} alt="" />
                  <p class="py-4">${data?.video?.description}</p>
                  </div>
                  <div class="modal-action">
                    <form method="dialog">
                      <!-- if there is a button in form, it will close the modal -->
                      <button class="btn">Close</button>
                    </form>
                  </div>`;
  modalBox.innerHTML = modalText;
}

const displayVideo = (data) => {
  const videosSection = document.getElementById("videos-section");
  videosSection.innerHTML = "";

  if (data.length === 0) {
    videosSection.classList.remove("grid");
    videosSection.innerHTML = `
        <div class="flex flex-col justify-center items-center">
          <div class="mb-8">
            <img src="./assets/icon.png" alt="No content icon" />
          </div>
          <h2 class="font-bold text-3xl">Oops!! Sorry, There is no content here</h2>
        </div>

`;
    return;
  } else {
    videosSection.classList.add("grid");
  }

  data.forEach((item) => {
    function times(time) {
      const minutes = Math.floor(time / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);

      return {
        year: years,
        month: months % 12,
        day: days % 30,
        hrs: hours % 24,
        min: minutes % 60,
        second: time % 60,
      };
    }

    const postedDateTimes = item?.others?.posted_date
      ? times(item?.others?.posted_date)
      : "";

    const append = `
                <div>
                  <div class="mb-4">
                    <div class="relative">
                      <img
                        class="w-[312px] h-[200px] object-cover"
                        src="${item?.thumbnail}"
                        alt=""
                      />
                      ${
                        postedDateTimes &&
                        `<div class="absolute right-3 bottom-3 p-1 rounded bg-black text-white  justify-center flex items-center gap-2">
                              ${
                                postedDateTimes.year > 0
                                  ? `<p>${postedDateTimes.year} year </p>`
                                  : ""
                              }
                              ${
                                postedDateTimes.month > 0
                                  ? `<p>${postedDateTimes.month} month</p>`
                                  : ""
                              }
                              ${
                                postedDateTimes.day > 0
                                  ? `<p>${postedDateTimes.day} day </p>`
                                  : ""
                              }
                              ${
                                postedDateTimes.hrs > 0
                                  ? `<p>${postedDateTimes.hrs} hr</p>`
                                  : ""
                              }
                              <p>${postedDateTimes.min} min </p>
                              <p>${postedDateTimes.second} second ago</p>
                        </div>`
                      }                      
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div>
                      <img
                        class="w-10 h-10 rounded-full object-cover"
                        src="${item?.authors[0].profile_picture}"
                        alt=""
                      />
                    </div>
                    <div>
                      <h2 class="font-bold mb-2">${item?.title}</h2>
                      <div class="mb-2.5 flex items-center gap-2">
                        <h3 class="text-[#171717B3]">${
                          item?.authors[0]?.profile_name
                        }</h3>
                        <div>${
                          item?.authors[0]?.verified === true
                            ? '<img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="verified" />'
                            : ""
                        }</div>
                      </div>
                        <div class="text-[#171717B3]">${
                          item?.others?.views
                        } views</div>
                      </div>
                  </div>
                    <div class="flex justify-end">
                    <button onclick="detailsFun('${
                      item?.video_id
                    }')" class="btn mt-3  bg-red-500">Details</button>
                    </div>
                </div> `;
    videosSection.innerHTML += append;
  });
};
//  search input
document.getElementById("search-input").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});
loadVideos();
