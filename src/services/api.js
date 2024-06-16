// api.js
import { createRequest } from "../utils/api-utils";
import axios from "axios";


const BASE_URL = "https://ddubam.site/api";
// const BASE_URL = "http://ddubam.site:8080/api";

const APP_KEY = process.env.REACT_APP_APP_KEY;


//카카오 계정정보에서 id추출해 뚜밤뚜밤 계정정보 요청
export const fetchUserData = async (userId) => {
  return createRequest('get', `/members/${userId}`);
};

//완료한 산책 리스트 조회(구)
// export const fetchFinishedPaths = async (userId) => {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}/members/walks/complete/${userId}`
//     );
//     // console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

//완료한 산책 리스트 조회
export const fetchFinishedPaths = async (userId) => {
  return createRequest('get', `/members/walks/complete/${userId}`);

};

//찜한 산책로 리스트 조회
export const fetchLikedPaths = async (userId) => {
  return createRequest('get', `/members/walks/select/${userId}`);
};

//주변 산책로 리스트 조회
export const fetchNearbyPaths = async (lat, lng) => {
  return createRequest('get', `/walks/near/${lat}/${lng}`);
};

//키워드로 장소 검색 -> 목적지 위도, 경도 얻음
export const keywordSearch = async (keyword) => {
  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json`,
      {
        params: {
          query: keyword,
        },
        headers: {
          Authorization: `KakaoAK ${APP_KEY}`,
        },
      }
    );
    // console.log(response.data);
    return response.data.documents;
  } catch (error) {
    console.log(error);
  }
};

//인기 산책로 리스트 조회
export const fetchPopularPaths = async () => {
  return createRequest('get', `/walks/popular`);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

//관광지 리스트 조회
export const fetchAttractions = async () => {
  try {
    const response = await createRequest('get', `/attractions`);
    //console.log(response);
    const shuffledData = shuffleArray(response);
    const randomFive = shuffledData.slice(0, 5);
    // console.log(randomFive);
    return randomFive;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//산책로 상세정보 조회
export const fetchPathDetail = async (trailId, userId) => {
  return createRequest('get', `/walks/${trailId}/${userId}`);
};

export const logoutRequest = async () => {
  return createRequest('get', `/members/kakao/logout`);
};

//검색 결과로 가는 길
export const fetchNavigationData = async (
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude
) => {

      // `${BASE_URL}/walks/search/37.5691065/126.97865009/${endLatitude}/${endLongitude}`
   
  return createRequest('get', `/walks/search/${startLatitude}/${startLongitude}/${endLatitude}/${endLongitude}`);
};

//인기 산책로로 가는 길 + 디테일
export const navigateToPopular = async (
  trailId,
  userId,
  latitude,
  longitude
) => {
  return createRequest('get', `/walks/popular/route/${trailId}/${userId}/${latitude}/${longitude}`);
};

//검색어 추가
export const addSearchKeyword = async (userId, keyword) => {
  const data = {
    userId: userId,
    search: keyword,
  };

  try {
    await axios.post(`${BASE_URL}/members/search/${userId}/${keyword}`, data);
  } catch (error) {
    console.log(error);
  }
};

const token = localStorage.getItem("token");
//최근 검색어 조회
export const getRecentSearchKeywords = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/members/search/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//검색어 삭제
export const deleteKeyword = async (userId, searchId) => {
  const data = {
    userId: userId,
    searchId: searchId,
  };
  try {
    await axios.delete(
      `${BASE_URL}/members/search/${userId}/${searchId}`,
      data
    );
  } catch (error) {
    console.log(error);
  }
};

//도착지 후기 추가
export const writeDestinationReview = async (
  userId,
  review,
  destinationId,
  destinationTitle
) => {
  const data = { userId, review, destinationId, destinationTitle };
  try {
    await axios.post(`${BASE_URL}/members/walks/search/complete`, data);
  } catch (error) {
    console.log(error);
  }
};
