const hostname = 'atlas.microsoft.com'
const apiVersion = '1.0'
const dataFormat = 'geojson'
const url = require('url')

function send(method, path, body, returnHeaders) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, `https://${hostname}${path}`, true)
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return
      if (xhr.status < 400 && xhr.status > 0) {
        if (returnHeaders)
          return resolve({ location: xhr.getResponseHeader('location') })
        return resolve(JSON.parse(xhr.responseText || '{}'))
      }
      const errorMessage = `Error connecting: ${xhr.status || 'NO_CONNECTION'}`
      reject(errorMessage)
    }

    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Accept', 'application/json')

    if (body) return xhr.send(JSON.stringify(body))
    xhr.send()
  })
}

module.exports = function(options) {
  const toPath = (route, params) => {
    if (!params) params = {}
    params['subscription-key'] = options.key
    params['api-version'] = apiVersion
    params['dataFormat'] = dataFormat
    const queryString = Object.keys(params)
      .filter(key => !!params[key])
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    return `${route}?${queryString}`
  }

  const Data = {
    upload: value => {
      return new Promise((resolve, reject) => {
        send('POST', toPath('/mapData/upload'), value, true)
          .then(data => {
            const { location } = data
            const { pathname } = url.parse(location)
            const uploadId = pathname.split('/')[2]
            resolve({ uploadId })
          })
          .catch(reject)
      })
    },
    check: uploadId => send('GET', toPath(`/mapData/${uploadId}/status`)),
    list: () => send('GET', toPath('/mapData')),
    delete: udid => send('DELETE', toPath(`/mapData/${udid}`)),
    download: udid => send('GET', toPath(`/mapData/${udid}`)),
    getDownloadLink: udid => `https://${hostname}${toPath(`/mapData/${udid}`)}`,
    update: (udid, value) => {
      return new Promise((resolve, reject) => {
        send('PUT', toPath(`/mapData/${udid}`), value, true)
          .then(data => {
            const { location } = data
            const { pathname } = url.parse(location)
            const uploadId = pathname.split('/')[2]
            resolve({ uploadId })
          })
          .catch(reject)
      })
    }
  }

  const Spatial = {
    getClosestPoint: (udid, lat, lon, numberOfClosestPoints) => {
      const params = { udid, lat, lon, numberOfClosestPoints }
      return send('GET', toPath('/spatial/closestPoint/json', params))
    },
    getGreatCircleDistance: (pointA, pointB) => {
      const params = { query: `${pointA.join()}:${pointB.join()}` }
      return send('GET', toPath('/spatial/greatCircleDistance/json', params))
    }
  }

  return {
    Data,
    Spatial
  }
}
