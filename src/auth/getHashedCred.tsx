import * as React from 'react'
import * as CryptoJS from 'crypto-js'

function getHashString(uri:string, secret_key: string): string {
    const computedHash = CryptoJS.HmacMD5(uri, secret_key)
    const computedHashString: string = computedHash.toString(CryptoJS.enc.Base64)
    return computedHashString
}

export default getHashString
