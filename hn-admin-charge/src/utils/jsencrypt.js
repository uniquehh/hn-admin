import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMJGfKxPtcKCs+I+NvIucHhyYia0yw2I6Pg0ew/7kPyuOuxHK9g/XrUHM4M8II+9ZCJI+9KFIFi4101tZLOH06xU1c9Vm4uC2QKAC4reRotPwciH9qENOt2gyaU5PD0RUR3pFzRDaf68yeTYMvOFAmt1KUyNJFz0T+kra7feu19wIDAQAB'


// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}


