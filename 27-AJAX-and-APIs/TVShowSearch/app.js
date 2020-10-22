const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    var searchTerm = form.elements.query.value;
    // var response = await axios.get(`http://api.tvmaze.com/search/shows?q=${searchTerm}`)
    var config = { params: { q: searchTerm, isFunny: 'colt' } }
    var response = await axios.get(`http://api.tvmaze.com/search/shows`, config)
    makeImages(response.data);
    form.elements.query.value = '';
})

const makeImages = (shows) => {
    for (let result of shows) {
        if(result.show.image){
            var img = document.createElement('img');
            img.src = result.show.image.medium;
            document.body.append(img);
        }
    }
}