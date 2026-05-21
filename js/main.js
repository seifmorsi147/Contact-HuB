//& Memory-To-Get-Access-Inputes-&-Global variable -->
var contactImageInpute = document.getElementById("photoInput");
var contactNameInpute = document.getElementById("contactName");
var contactNumperInpute = document.getElementById("contactNumber");
var contactEmailInpute = document.getElementById("contactEmail");
var contactAddressInpute = document.getElementById("contactAddress");
var contactSelectGroupInpute = document.getElementById("selectGroup");
var contactDescriptionInpute = document.getElementById("contactDescription");
var contactCheckFavorite = document.getElementById("checkFavorite");
var contactCheckEmergncy = document.getElementById("checkEmergncy");
var addContactModal = document.getElementById("addContactModal");
var currentSearchTerm = "";
var uploadedImageBase64 = "";

var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");

var iconSetFav = document.getElementById("iconSetFav");
var iconDelFav = document.getElementById("iconDelFav");

//& Memory to save Index To Updates--->
var updateIndex = 0;

//& Memory-of-InputesRegex--->
var inputesRegx = {
  contactNameRegex: /^[A-Z][\sA-Za-z0-9_]{2,}$/,
  contactNumberRegex: /^(011|012|015|010)[0-9]{8}$/,
  contactEmailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  contactAddressRegex: /^[a-zA-Z].{3,}$/,
  // contactGroupRegex:/^(Friends|Family|Work|School|Other)$/
};

//& Memory-gradientsList--->
const gradientsList = {
  oceanBreeze:
    "linear-gradient(to right bottom, oklch(0.715 0.143 215.221) 0%, oklch(0.546 0.245 262.881) 100%)",
  sunsetGlow:
    "linear-gradient(to right bottom, oklch(0.65 0.25 30) 0%, oklch(0.55 0.22 340) 100%)",
  forestMist:
    "linear-gradient(to right bottom, oklch(0.75 0.15 150) 0%, oklch(0.45 0.18 190) 100%)",
  royalMidnight:
    "linear-gradient(to right bottom, oklch(0.40 0.19 280) 0%, oklch(0.25 0.15 320) 100%)",
  auroraNeon:
    "linear-gradient(to right bottom, oklch(0.80 0.25 120) 0%, oklch(0.60 0.22 240) 100%)",
  candyPop:
    "linear-gradient(to right bottom, oklch(0.75 0.22 330) 0%, oklch(0.65 0.20 300) 100%)",
  warmApricot:
    "linear-gradient(to right bottom, oklch(0.80 0.16 50) 0%, oklch(0.88 0.12 90) 100%)",
  cyberBlue:
    "linear-gradient(to right bottom, oklch(0.35 0.15 240) 0%, oklch(0.55 0.18 210) 100%)",
  emeraldLuxury:
    "linear-gradient(to right bottom, oklch(0.50 0.14 140) 0%, oklch(0.65 0.12 170) 100%)",
  vintageEarth:
    "linear-gradient(to right bottom, oklch(0.45 0.08 40) 0%, oklch(0.75 0.06 70) 100%)",
};

function getCardGradient() {
  const keys = Object.keys(gradientsList);
  return gradientsList[keys[Math.floor(Math.random() * keys.length)]];
}
//& End-gradientsList

//& Array--ContactList
var contactList = [];

//& Array--favoriteList
var favoriteList = [];

//& Array--emergncyList
var emergncyList = [];

showLength();

//& show Data in localStorage & Save contactList When Rolad--->
if (localStorage.getItem("contactList")) {
  contactList = JSON.parse(localStorage.getItem("contactList"));
}
displayContacts(contactList);

//& show Data in localStorage & Save favoriteList When Rolad--->
if (localStorage.getItem("favoriteList")) {
  favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
}
displayFavoriteList(favoriteList);

//& show Data in localStorage & Save emergncyList When Rolad--->
if (localStorage.getItem("emergncyList")) {
  emergncyList = JSON.parse(localStorage.getItem("emergncyList"));
}
displayEmergncyList(emergncyList);

//& Func-To-Add-Contac--->
function addContact() {
    var inputsToCheck = [
        {
            input: contactNameInpute,
            regex: inputesRegx.contactNameRegex,
            label: "contact Name",
        },
        {
            input: contactNumperInpute,
            regex: inputesRegx.contactNumberRegex,
            label: "contact Number",
        },
        {
            input: contactEmailInpute,
            regex: inputesRegx.contactEmailRegex,
            label: "contact Email",
        },
        {
            input: contactAddressInpute,
            regex: inputesRegx.contactAddressRegex,
            label: "contact Address",
        },
    ];
    for (var i = 0; i < inputsToCheck.length; i++) {
        var item = inputsToCheck[i];
        if (inputesValidation(item.regex, item.input) == false) {
            Swal.fire({
                icon: "error",
                title: `Missing ${item.label}`,
                text: "Please enter a valid Data !",
            });

            return;
        }
    }
  //   //* check DublictedNumber
  var isNumberDuplicate = contactList.some(
    (contact) => contact.number === contactNumperInpute.value.trim(),
  );
  if (isNumberDuplicate) {
    Swal.fire({
      icon: "error",
      title: `Duplicate Phone Number`,
      text: `A contact with this phone number already exists !`,
    });
    return;
  }

  var imageName = contactImageInpute.files[0]?.name;
  var imagePath = imageName ? `./images/${imageName}` : "";

  //* Memory-contactList
  var contact = {
    image: uploadedImageBase64 ? uploadedImageBase64 : imagePath,
    name: contactNameInpute.value,
    number: contactNumperInpute.value,
    Email: contactEmailInpute.value,
    Address: contactAddressInpute.value,
    group: contactSelectGroupInpute.value,
    note: contactDescriptionInpute.value,
    checkFav: contactCheckFavorite.checked,
    checkEmr: contactCheckEmergncy.checked,
    cardColor: getCardGradient(),
  };

  //*Add Contacts-in-ContactList
  contactList.push(contact);

  //* displayProducts
  displayContacts(contactList);

  //* save Data in LocalStorage
  localStorage.setItem("contactList", JSON.stringify(contactList));

  //* Call-Func-addEmergncy
  if (contact.checkEmr) {
    addEmergncyList();
  }

  //* Call-Func-addFavorite
  if (contact.checkFav) {
    addFavoriteList();
  }

  document.querySelector('#addContactModal [data-bs-dismiss="modal"]').click();

  //* showLength
  showLength();

  //* Show success Alert
  Swal.fire({
    title: "Added!",
    text: "Product has been added successfully!",
    icon: "success",
  });

  //* resetAllINputes
  resetAllInputes();
}

//& Func--DisplayContacts---->
function displayContacts(contacts) {
  cartona = "";
  if (contacts.length === 0) {
    document.getElementById("rowData").innerHTML = `
      <div class="col-12 text-center py-5">
          <div class="mb-4">
            <i class="fa-solid fa-box-open text-muted" style="font-size: 5rem;"></i>
          </div>
          <h2 class="h4 text-muted mb-3">No contacts Found</h2>
          <p class="text-secondary">It looks like your inventory is empty. Start adding some contacts using the form above!</p>
        </div>
      `;
    return;
  }
  for (var i = 0; i < contacts.length; i++) {
    //* check-to-image-value-or-not
    var hasImage = contacts[i].image && contacts[i].image.trim() !== "";

    var savedColor = contacts[i].cardColor
      ? contacts[i].cardColor
      : getCardGradient();

    var backGroundStyle = "";
if (hasImage) {
  // لو أولها data:image يعني دي صورة Base64 حقيقية، لو لأ يبقى مسار قديم
  var imgSrc = contacts[i].image.startsWith("data:image") ? contacts[i].image : contacts[i].image;
  backGroundStyle = `background-image: url('${imgSrc}'); background-size: cover; background-position: center;`;
} else {
  backGroundStyle = `background-image: ${savedColor};`;
} 

    var crruntName = "";
    if (!hasImage && contacts[i].name) {
      crruntName = contacts[i].name
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }

    cartona += `
   <div class="inner col-sm-6 col-md-6 mb-3">
                  <div class="contact-card shadow-sm">
                    <div class="header d-flex align-items-center">
                      <div
                        class="image d-flex justify-content-center align-items-center position-relative"
                        style="${backGroundStyle}"
                      >
                        ${crruntName}
                        <div id="iconCheck"
                          class="icon-favorite d-flex justify-content-center align-items-center position-absolute ${contacts[i].checkFav === false ? "d-none" : "d-block"}"
                        >
                          <i class="fa-solid fa-star "></i>
                        </div>
                        <div
                          class="icon-emergncy d-flex justify-content-center align-items-center position-absolute  ${contacts[i].checkEmr === false ? "d-none" : "d-block"}"
                        >
                          <i class="fa-solid fa-heart-pulse "></i>
                        </div>
                      </div>
                      <div class="content">
                        <h3>${highlightText(contacts[i].name, currentSearchTerm)}</h3>
                        <div class="phoneNumber d-flex align-items-center">
                          <div class="icon">
                            <i class="fa-solid fa-phone"></i>
                          </div>
                          <span>${highlightText(contacts[i].number, currentSearchTerm)}</span>
                        </div>
                      </div>
                    </div>
                    <div class="conctiones">
                      <div id="email" class="email d-flex align-items-center ${contacts[i].Email === "" ? "d-none" : ""}">
                       <div class="icon icon-email">
                          <i class="fa-solid fa-envelope"></i>
                          </div>
                          <span>${highlightText(contacts[i].Email, currentSearchTerm)}</span>
                         
                      </div>
                      <div class="location d-flex align-items-center ${contacts[i].Address === "" ? "d-none" : ""}">
                        <div class="icon icon-location">
                          <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <span>${contacts[i].Address}</span>
                      </div>
                    </div>
                    <div class="badges ">
                      <span class="group "> ${contacts[i].group} </span>
                      <span class="emergncy ${contacts[i].checkEmr === false ? "d-none" : ""}">
                        <i class="fa-solid fa-heart-pulse"></i>
                        Emergency
                      </span>
                    </div>
                    <hr />
                    <div
                      class="footer d-flex align-items-center justify-content-between"
                    >
                      <div
                        class="conection d-flex justify-content-center align-items-center"
                      >
                        <a href=" tel:${contacts[i].number}" title="Call" class="icon-call ${contacts[i].number === "" ? "d-none" : ""}">
                          <i class="fa-solid fa-phone"></i>
                        </a>
                       <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${contacts[i].Email}"  target="_blank" title="Email" class="icon-email ${contacts[i].Email === "" ? "d-none" : ""}">
                       <i class="fa-solid fa-envelope"></i>
                             </a>
                      </div>
                      <div class="btns-action d-flex align-items-center gap-2">
                        <button class="addFavorite">
                          <i id="iconSetFav"  onclick="setInFavoriteList(${contacts.length < contactList.length ? contacts[i].oldIndex : i})" class="fa-regular fa-star  ${contacts[i].checkFav === true ? "d-none" : "d-block"}"></i>
                          <!-- new-icon-AfterClick -->
                          <i id="iconDelFav" onclick="deletInFavoriteList(${contacts.length < contactList.length ? contacts[i].oldIndex : i})"  class="fa-solid fa-star fav-after d-flex justify-content-center align-items-center ${contacts[i].checkFav === false ? "d-none" : "d-block"}"></i>
                        </button>
                        <button class="addEmergncy">
                          <i onclick="setInEmergncyList(${contacts.length < contactList.length ? contacts[i].oldIndex : i})" class="fa-regular fa-heart ${contacts[i].checkEmr === true ? "d-none" : "d-block"}"></i>
                          <!-- new-icon-AfterClick -->
                          <i onclick="deleteInEmergncyList(${contacts.length < contactList.length ? contacts[i].oldIndex : i})"
                            class="fa-solid fa-heart-pulse emer-after d-flex justify-content-center align-items-center ${contacts[i].checkEmr === false ? "d-none" : "d-block"}"
                          ></i>
                        </button>
                        <button onclick="setDataInInputes(${contacts.length < contactList.length ? contacts[i].oldIndex : i})" class="setData">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="deleteContact(${  contacts.length < contactList.length ? contacts[i].oldIndex : i   })" class="deleteBtn">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
   `;
  }

  document.getElementById("rowData").innerHTML = cartona;
}

// & reset-AllInputes-->
function resetAllInputes() {
  uploadedImageBase64 = "";
    contactImageInpute.value = "";  
  contactNameInpute.value = "";
  contactNumperInpute.value = "";
  contactEmailInpute.value = "";
  contactAddressInpute.value = "";
  contactSelectGroupInpute.value = "";
  contactDescriptionInpute.value = "";
  contactCheckFavorite.checked = false;
  contactCheckEmergncy.checked = false;


  contactNameInpute.classList.remove("is-valid");
  contactNumperInpute.classList.remove("is-valid");
  contactEmailInpute.classList.remove("is-valid");
  contactAddressInpute.classList.remove("is-valid");
}

//& Add to favoriteList--->
function addFavoriteList() {
  favoriteList = [];
  var imageName = contactImageInpute.files[0]?.name;
  var imagePath = imageName ? `./images/${imageName}` : "";

  //* Memory-contactFavorite
  for (var i = 0; i < contactList.length; i++) {
    
    if (contactList[i].checkFav === true) {
      
      var contactFavorite = {
        image: contactList[i].image,
        name: contactList[i].name,
        number: contactList[i].number,
        cardColor: contactList[i].cardColor,
      };
      favoriteList.push(contactFavorite);
    }}
  //* displayContacts
  displayFavoriteList(favoriteList);

  //* save Data in LocalStorage
  localStorage.setItem("favoriteList", JSON.stringify(favoriteList));

  //* resetAllINputes
  //   resetAllInputes();
}

//& Display favoriteList
function displayFavoriteList(contacts) {
  cartona = "";
  if (contacts.length === 0) {
    document.getElementById("rowDataFavrite").innerHTML = `
      <div class=" text-center py-2">
          <p class="text-secondary">No favorites yet</p>
        </div>
      `;
    return;
  }
  for (var i = 0; i < contacts.length; i++) {
    //* check-to-image-value-or-not
    var hasImage = contacts[i].image && contacts[i].image.trim() !== "";

    var savedColor = contacts[i].cardColor
      ? contacts[i].cardColor
      : getCardGradient();

    var backGroundStyle = hasImage
      ? `background-image: url('${contacts[i].image}'); background-size: cover; background-position: center;`
      : `background-image: ${savedColor};`;

    var crruntName = "";
    if (!hasImage && contacts[i].name) {
      crruntName = contacts[i].name
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }
    cartona += `
     <div class="contact-fav mb-2 ">
                  <div class="image" style="${backGroundStyle}" >
                     ${crruntName}
                  </div>
                  <div class="content " >
                    <h4>${contacts[i].name}</h4>
                    <p>${contacts[i].number}</p>
                  </div>
                  <a  href="tel:${contacts[i].number}" class="contact-number number-fav">
                    <i class="fa-solid fa-phone"></i>
                  </a>
                </div>
    `;
  }

  document.getElementById("rowDataFavrite").innerHTML = cartona;
}
//& Add to EmergncyList--->
function addEmergncyList() {
  emergncyList = [];
  var imageName = contactImageInpute.files[0]?.name;
  var imagePath = imageName ? `./images/${imageName}` : "";

  //* Memory-contactEmergncy
  for (var i = 0; i < contactList.length; i++) {
    
    if (contactList[i].checkEmr === true) {
      var contactEmergncy = {
        image: contactList[i].image,
        name: contactList[i].name,
        number: contactList[i].number,
        cardColor: contactList[i].cardColor,
      };
      emergncyList.push(contactEmergncy);
    }
  }

  //* displayContacts
  displayEmergncyList(emergncyList);

  //* save Data in LocalStorage
  localStorage.setItem("emergncyList", JSON.stringify(emergncyList));

  //* resetAllINputes
  //   resetAllInputes();
}

//& Display favoriteList
function displayEmergncyList(contacts) {
  cartona = "";
  if (contacts.length === 0) {
    document.getElementById("rowDataEmergncy").innerHTML = `
      <div class=" text-center py-2">
          <p class="text-secondary">No favorites yet</p>
        </div>
      `;
    return;
  }
  for (var i = 0; i < contacts.length; i++) {
    //* check-to-image-value-or-not
    var hasImage = contacts[i].image && contacts[i].image.trim() !== "";

    var savedColor = contacts[i].cardColor
      ? contacts[i].cardColor
      : getCardGradient();

    var backGroundStyle = hasImage
      ? `background-image: url('${contacts[i].image}'); background-size: cover; background-position: center;`
      : `background-image: ${savedColor};`;

    var crruntName = "";
    if (!hasImage && contacts[i].name) {
      crruntName = contacts[i].name
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }
    cartona += `
   <div class="contact-emr ">
                  <div class="image" style="${backGroundStyle}">
                    ${crruntName}
                  </div>
                  <div class="content ">
                    <h4>${contacts[i].name}</h4>
                    <p>${contacts[i].number}</p>
                  </div>
                  <a href="tel: ${contacts[i].number}" class="contact-number number-emr">
                    <i class="fa-solid fa-phone"></i>
                  </a>
                </div>
    `;
  }

  document.getElementById("rowDataEmergncy").innerHTML = cartona;
}

//& Ubdate and Show length of total & favorite & Emergency---->
function showLength() {
  document.getElementById("rowTotal").innerHTML =
    `<p>Total</p> <p>${contactList.length}</p>`;
  document.getElementById("rowFav").innerHTML =
    ` <p>Favorites</p> <p>${favoriteList.length}</p>`;
  document.getElementById("rowEmr").innerHTML = `<p class="fs-sm">Emergency</p> <p>${emergncyList.length}</p>`;
}
showLength();

//& Check Inputes validation--->
function inputesValidation(regex, contactInput) {
  if (regex.test(contactInput.value)) {
    contactInput.classList.add("is-valid");
    contactInput.classList.remove("is-invalid");
    contactInput.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    contactInput.classList.add("is-invalid");
    contactInput.classList.remove("is-valid");
    contactInput.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}

//& func--set-Data-in-Inputes-To-Updates-->
function setDataInInputes(index) {
  updateIndex = index;
  var myModal = new bootstrap.Modal(addContactModal);
  myModal.show();
  //* setData InInputes
  contactNameInpute.value = contactList[index].name;
  contactNumperInpute.value = contactList[index].number;
  contactEmailInpute.value = contactList[index].Email;
  contactAddressInpute.value = contactList[index].Address;
  contactSelectGroupInpute.value = contactList[index].group;
  contactDescriptionInpute.value = contactList[index].note;
  contactCheckFavorite.checked = contactList[index].checkFav;
  contactCheckEmergncy.checked = contactList[index].checkEmr;

    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none")
}

//& Update-Data-IN-Inputes-After-Set-Values--->
function updateData() {
    var inputsToCheck = [
        {
            input: contactNameInpute,
            regex: inputesRegx.contactNameRegex,
            label: "contact Name",
        },
        {
            input: contactNumperInpute,
            regex: inputesRegx.contactNumberRegex,
            label: "contact Number",
        },
        {
            input: contactEmailInpute,
            regex: inputesRegx.contactEmailRegex,
            label: "contact Email",
        },
        {
            input: contactAddressInpute,
            regex: inputesRegx.contactAddressRegex,
            label: "contact Address",
        },
    ];

    for (var i = 0; i < inputsToCheck.length; i++) {
        var item = inputsToCheck[i];
        if (inputesValidation(item.regex, item.input) == false) {
            Swal.fire({
                icon: "error",
                title: `Missing ${item.label}`,
                text: "Please enter a valid Data !",
            });
            return;
        }
    }

    var isNumberDuplicate = contactList.some(
        (contact, index) => contact.number === contactNumperInpute.value.trim() && index !== updateIndex
    );
    
    if (isNumberDuplicate) {
        Swal.fire({
            icon: "error",
            title: `Duplicate Phone Number`,
            text: `A contact with this phone number already exists !`,
        });
        return;
    }

    if (uploadedImageBase64) {
    contactList[updateIndex].image = uploadedImageBase64;
}
   
    contactList[updateIndex].name = contactNameInpute.value.trim();
    contactList[updateIndex].number = contactNumperInpute.value;
    contactList[updateIndex].Email = contactEmailInpute.value;
    contactList[updateIndex].Address = contactAddressInpute.value;
    contactList[updateIndex].group = contactSelectGroupInpute.value;
    contactList[updateIndex].note = contactDescriptionInpute.value;
    contactList[updateIndex].checkFav = contactCheckFavorite.checked;
    contactList[updateIndex].checkEmr = contactCheckEmergncy.checked;

   
    localStorage.setItem("contactList", JSON.stringify(contactList));
    displayContacts(contactList);

   
    addFavoriteList();
    addEmergncyList();

    
    showLength();
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
    
    resetAllInputes();

  document.querySelector('#addContactModal [data-bs-dismiss="modal"]').click();

     Swal.fire({
        title: "Updated!",
        text: "Contact has been updated successfully!",
        icon: "success",
    });
}

//& Delete-func
function deleteContact(index) {
      //* valid before deleteContact
  Swal.fire({
  title: "Delete contact?",
  text: `Are you sure you want to delete   ${ contactList[index].name }  ? This action cannot be undone.`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#C62222",
  cancelButtonColor: "#606773",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
     //* deleteProduct from index
     contactList.splice(index, 1);

      //* save edite in localStorage
      localStorage.setItem("contactList", JSON.stringify(contactList));

      favoriteList = contactList.filter(c => c.checkFav === true);
      localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
      displayFavoriteList(favoriteList);

      emergncyList = contactList.filter(c => c.checkEmr === true);
      localStorage.setItem("emergncyList", JSON.stringify(emergncyList));
      displayEmergncyList(emergncyList);

      if (typeof showLength === "function") {
        showLength();
      }

  //* displayProducts after delete
 displayContacts(contactList);
  
     Swal.fire({
    title: "Deleted!",
    text: "Product has been deleted.",
    icon: "success"
  })};
});

}

//& Favorite Button Toggle Actions on Card  --->
function setInFavoriteList(index) {
  contactList[index].checkFav = true;
  updateAppListsAndStorage();
}

function deletInFavoriteList(index) {
  contactList[index].checkFav = false;
  updateAppListsAndStorage();
}

//& Emergency Button Toggle Actions on Card --->
function setInEmergncyList(index) {
  contactList[index].checkEmr = true;
  updateAppListsAndStorage();
}

function deleteInEmergncyList(index) {
  contactList[index].checkEmr = false;
  updateAppListsAndStorage();
}

//& Centralized Function to sync LocalStorage, Filter Sub-lists, and Refresh UI --->
function updateAppListsAndStorage() {
 localStorage.setItem("contactList", JSON.stringify(contactList));
  displayContacts(contactList);

  
  addFavoriteList();
  addEmergncyList();

  showLength();
}

//& Func-Search-Contact --->
function searchContact(searchInput) {
  // Get the search input value and convert it to lowercase
  var searchTerm = searchInput.value.toLowerCase();
  currentSearchTerm = searchTerm; // Save it to the global variable

  // Empty array to store the filtered contacts
  var filterProduct = [];

  // Standard for loop to look through all contacts
  for (var i = 0; i < contactList.length; i++) {
    
    // Temporary variables to hold text for safe checking
    var nameText = "";
    var numberText = "";
    var emailText = "";

    // Code safety: check if the property exists before converting to lowercase
    if (contactList[i].name) {
      nameText = contactList[i].name.toLowerCase();
    }
    if (contactList[i].number) {
      numberText = contactList[i].number.toLowerCase();
    }
    if (contactList[i].Email) {
      emailText = contactList[i].Email.toLowerCase();
    }

    // Standard if condition: check if the search term is included in name, number, or email
    if (
      nameText.includes(searchTerm) || 
      numberText.includes(searchTerm) || 
      emailText.includes(searchTerm)
    ) {
      // Save the original main array index
      contactList[i].oldIndex = i;
      // Push the matched contact object into the filtered array
      filterProduct.push(contactList[i]);
    }
  }

  // Display the filtered array instead of the full main list
  displayContacts(filterProduct);
}

//& Helper function to highlight matching text --->
function highlightText(text, searchTerm) {
  // If there is no search word or the text is empty, return the original text
  if (searchTerm == "" || text == "") {
    return text;
  }
  
  // Create a regular expression to find the search word case-insensitively (gi)
  var regex = new RegExp("(" + searchTerm + ")", "gi");
  
  // Replace the matched term with a styled Bootstrap background span
  return text.replace(regex, '<span class="bg-warning text-dark p-1 rounded-1">$1</span>');
}

//& Add Image In strage User [Extra]--->
contactImageInpute.addEventListener("change", function () {
  var file = contactImageInpute.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageBase64 = e.target.result; 
    };
    reader.readAsDataURL(file);
  } else {
    uploadedImageBase64 = "";
  }
});