// classes
const youtube = new Youtube(),
  svUI = new SearchAndVideoUi(),
  chUI = new ChannelsUi(),
  googleAuth = new GoogleAuth();

// Other variables
let searchParameter = '';

// Loads the Google API Client library for use in all other files and init client
googleAuth.loadClient();

// Allows page reload by clicking brand logo
brand.addEventListener('click', () => window.location.reload());

//
console.log(process.env);
