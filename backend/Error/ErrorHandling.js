
function handleAPIError(error) {
    switch (error) {
      case 404:
        console.error('Module not found Error -> ',error.message)
        break
      case 500:
        console.error('Internal Server Error -> ',error.message)
        break
      default:
        console.error('Url Error -> ', error.message)
    }
  }
  
  function handleNetworkError(error) {
    console.error('Network Error -> ', error.message)
  }
  
  module.exports = {
    handleAPIError,
    handleNetworkError,
  }
  