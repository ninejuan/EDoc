import url from 'url'

/**
 * 
 * @param originURL string
 * @param reqURL string
 * @returns bool
 */
async function check(originURL: string, reqURL: string) {
    let reqDomain = url.parse(reqURL, true).hostname;
    if (originURL !== reqDomain) return false;
    else return true;
}

export default check;