export const useData = () => {
  const { success, warning, error } = useSwal()
  const lottie = useState('fin_lottie')

  const request = async (url, options) => {
    if (options.method !== 'GET' && typeof(options.body) === 'undefined') {
      options.body = {}
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    options.signal = controller.signal

    options.body = JSON.stringify(options.body)
    lottie.value = true
    const result = await $fetch(url, options).then(response => {
        clearTimeout(timeoutId)
        return response
      })
      .catch((e) => {
        // handle errors and timeout error
        console.log(e.data)
        if (e.data.statusCode) { return { error: e.data } }
        warning('', 'There may be issues with connection with your site. Please try again.')
        router.push({ name: 'site-list' })
        return { success: false, data: [] }
      })
    lottie.value = false

    if (result.redirect) {
      router.push({ name: result.redirect })
      return false
    }

    if (result.error?.message) {
      error('Error', result.error.message)
      return false
    }

    if (result.success === false && result.message) {
      error('Error', result.message)
      return false
    }

    if (result.success === true && result.message) {
      success('Success', result.message)
    }

    return result
  }

  const post = async (url, options) => {
    options.method = 'POST'
    const result = await request(url, options)
    return result
  }

  const get = async (url, options) => {
    options.method = 'GET'
    const result = await request(url, options)
    return result
  }

  return {
    request,
    post,
    get
  }
}