export async function logout(setUserEmail,setUserType,userAccessToken,userRefreshToken,axiosJWT)
{
    setUserEmail(null)
    setUserType(null)
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userType')
    localStorage.removeItem('userAccessToken');
    localStorage.removeItem('userRefreshToken');
    const token={
        token:userRefreshToken
    }
    await axiosJWT.post("http://localhost:9000/Logout",token, {headers:{'authorization':"Bearer "+userAccessToken}})
}