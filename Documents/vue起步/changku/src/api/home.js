import '@/plugins/axios.js';
// export const getIndexData
export const getIndexData = function() {
    return window.axios.get("/index/index").catch(function(error) {
        console.log(error);

    })
}