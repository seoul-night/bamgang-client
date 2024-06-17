// api.js
import { createRequest } from "../utils/api-utils";
import axios from "axios";

const BASE_URL = "https://ddubam.site/api";
// const BASE_URL = "http://ddubam.site:8080/api";

const APP_KEY = process.env.REACT_APP_APP_KEY;

//카카오 계정정보에서 id추출해 뚜밤뚜밤 계정정보 요청
export const fetchUserData = async (userId) => {
  return createRequest("get", `/members/${userId}`);
};

//완료한 산책 리스트 조회
export const fetchFinishedPaths = async (userId) => {
  return createRequest("get", `/members/walks/complete/${userId}`);
};

//찜한 산책로 리스트 조회
export const fetchLikedPaths = async (userId) => {
  return createRequest("get", `/members/walks/select/${userId}`);
};

//주변 산책로 리스트 조회
export const fetchNearbyPaths = async (lat, lng) => {
  return createRequest("get", `/walks/near/${lat}/${lng}`);
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
    return response.data.documents;
  } catch (error) {
    console.log(error);
  }
};

//인기 산책로 리스트 조회
export const fetchPopularPaths = async () => {
  return createRequest("get", `/walks/popular`);
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
    const response = await createRequest("get", `/attractions`);
    const shuffledData = shuffleArray(response);
    const randomFive = shuffledData.slice(0, 5);
    return randomFive;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//산책로 상세정보 조회
export const fetchPathDetail = async (trailId, userId) => {
  return createRequest("get", `/walks/${trailId}/${userId}`);
};

export const logoutRequest = async () => {
  return createRequest("get", `/members/kakao/logout`);
};

//검색 결과로 가는 길
export const fetchNavigationData = async (
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude
) => {
  return createRequest(
    "get",
    `/walks/search/${startLatitude}/${startLongitude}/${endLatitude}/${endLongitude}`
  );
};

//인기 산책로로 가는 길 + 디테일
export const navigateToPopular = async (
  trailId,
  userId,
  latitude,
  longitude
) => {
  return createRequest(
    "get",
    `/walks/popular/route/${trailId}/${userId}/${latitude}/${longitude}`
  );
};

//검색어 추가
export const addSearchKeyword = async (userId, keyword) => {
  const data = {
    userId: userId,
    search: keyword,
  };

  return createRequest("post", `/members/search/${userId}/${keyword}`, data);
};

//최근 검색어 조회
export const getRecentSearchKeywords = async (userId) => {
  return createRequest("get", `/members/search/${userId}`);
};

//검색어 삭제
export const deleteKeyword = async (userId, searchId) => {
  return createRequest("delete", `/members/search/${userId}/${searchId}`);
};

//도착지 후기 추가
export const writeDestinationReview = async (
  userId,
  review,
  destinationId,
  destinationTitle
) => {
  const data = { userId, review, destinationId, destinationTitle };
  return createRequest("post", `/members/walks/search/complete`, data);
};

//회원 탈퇴
export const deleteAccount = async (userId) => {
  return createRequest("delete", `/members/${userId}`);
};
