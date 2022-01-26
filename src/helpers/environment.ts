/**
 * environment.ts 
 */


/**
 * servicePath - From the environment variables, it generates the path to access the service endpoint on the server.
 * (Ex: http://ip:port/path to imagesdirectory/)
 * 
 * @returns - endpoint to access the services on the server.
 */
export const servicePath = () => {
    return `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/`
}

/**
 * imagesPath - From the environment variables, it generates the path to locate the images on the server.
 * (Ex: http://ip:port/path to imagesdirectory/)
 * 
 * @returns - path to access the images directory on the server.
 */
export const imagesPath = () => {
    return `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}${process.env.REACT_APP_SERVER_IMAGES}`
}

/**
 * documentPath - From the environment variables, it generates the path to locate the documents on the server.
 * (Ex: http://ip:port/path to documents directory/)
 * 
 * @returns - path to access the documents directory on the server.
 */
export const documentPath = () => {
    return `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}${process.env.REACT_APP_SERVER_DOCUMENTS}`
}

/* --------------------------------- */