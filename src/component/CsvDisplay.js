import React, { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import Checkbox from "./Checkbox/Checkbox";
import Pagination from "./Pagination/pagination";
import Dropdown from "./Dropdown/Dropdown";
import DropdownItem from "./Dropdown/DropdownItem";

const CsvDisplay = () => {

  const [data, setData] = useState([]); // CSV 데이터를 저장할 상태 변수
  const isMobile = window.matchMedia("(max-width: 768px)").matches; // 모바일로 접속 감지

  const options = ["2글자", "3글자", "4글자", "5글자", "6글자"]; // 체크박스 옵션
  const choiceItemoptions = ["15개씩 보기", "30개씩 보기", "50개씩 보기"];
  const filterItemoptions = [
    "글자 적은 순",
    "글자 많은 순",
    "생성 시도 적은 순",
    "생성 시도 많은 순",
    "경매 시작일 빠른 순",
    "경매 시작일 느린 순",
  ];

  const [searchData, setSearchData] = useState([]); // 검색한 데이터 실제 렌더링하는 데이터
  const [subData, setSubData] = useState([]); // 검색한 서브 데이터

  const [text, setText] = useState(""); // 검색 텍스트 상태 관리
  const [checkedItems, setCheckedItems] = useState({}); //체크박스 해제용
  const [selectedItems, setSelectedItems] = useState([]); // 체크박스 어떤 아이템인지 확인

  const [currentPage, setCurrentPage] = useState(1); // 페이징

  //몇개씩보기
  const [choiceItemsPerPage, setChoiceItemsPerPage] = useState(
    choiceItemoptions[0].slice(0, 2)
  ); // 닉네임 목록 개수

  const [filteroptionsString, setFiltertionsString] = useState([
    filterItemoptions[0],
  ]);

  //정렬 순서
  const [listoptionsString, setListoptionsString] = useState([
    choiceItemoptions[0],
  ]);

  //몇개씩보기 드롭다운 라벨
  const itemsPerPage = choiceItemsPerPage;

  //몇개씩보기 드롭다운 핸들러
  const handleChoiceItemClick = (item) => {
    //아이템이 문자열로 "10개씩 보기"로 오기때문에 앞 2글자 추출
    setChoiceItemsPerPage(item.slice(0, 2)); // 닉네임 목록 개수 설정
    setListoptionsString(item.slice(0, 2) + "개씩 보기"); // 목록 개수 text 표현 변수
  };

  //정렬기준 드롭다운 핸들러
  const handleFilterItemClick = (item, idx) => {
    setFiltertionsString(item);
    //"글씨 적은순","글씨 많은순","생성 시도 적은순","생성 시도 많은순","경매 시작일 빠른순","경매 시작일 느린순" 순서입니다
    // 정렬을 위해 searchData의 복사본 생성
    const sortedData = [...searchData];

    //글씨 적은순
    if (idx === 0) {
      sortedData.sort(
        (a, b) => a["캐릭터 이름"].length - b["캐릭터 이름"].length
      );
    }

    //글씨 많은순
    else if (idx === 1) {
      sortedData.sort(
        (a, b) => b["캐릭터 이름"].length - a["캐릭터 이름"].length
      );
    }

    // 기타 정렬 옵션
    else if (idx === 2) {
      sortedData.sort(
        (a, b) => a["이름 생성 시도 횟수"] - b["이름 생성 시도 횟수"]
      );
    } else if (idx === 3) {
      sortedData.sort(
        (a, b) => b["이름 생성 시도 횟수"] - a["이름 생성 시도 횟수"]
      );
    } else if (idx === 4) {
      sortedData.sort(
        (a, b) => new Date(a["경매 시작일"]) - new Date(b["경매 시작일"])
      );
    } else if (idx === 5) {
      sortedData.sort(
        (a, b) => new Date(b["경매 시작일"]) - new Date(a["경매 시작일"])
      );
    }

    setSearchData(sortedData);
  };

  // 페이징 계산
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage, 10);
  const endIndex = startIndex + parseInt(itemsPerPage, 10);
  const currentItems = searchData.slice(startIndex, endIndex);

  // 체크박스 상태가 변경되었을 때 호출되는 함수
  const handleCheckboxChange = useCallback((newCheckedItems) => {
    const checkedItemsArray = Object.keys(newCheckedItems).filter(
      (item) => newCheckedItems[item]
    );
    setCheckedItems(newCheckedItems);
    setSelectedItems(checkedItemsArray);
  }, []);

  // 초성 추출 함수
  const extractInitials = (text) => {
    const CHO_SUNG = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];

    let result = "";

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i) - 44032;

      if (code > -1 && code < 11172) {
        const chosungIndex = Math.floor(code / 588);
        result += CHO_SUNG[chosungIndex];
      } else {
        result += text[i]; // 한글이 아니면 그대로 추가
      }
    }

    return result;
  };

  // 검색바 text 입력업데이트 핸들러
  const handleChange = (e) => {
    setCurrentPage(1); // 현재 페이지를 첫 페이지로 이동
    setText(e.target.value); // 입력된 값으로 상태 업데이트
  };

  //페이징 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 한글 텍스트인지 확인하는 함수
  const isHangul = (text) => {
    return /^[가-힣]+$/.test(text);
  };

  //초기화 클릭시
  const entireHandleClick = () => {
    setSearchData(data); // 필터링된 데이터 원본데이터로 초기화
    setSubData(data); // 서브 데이터 원본데이터로 초기화
    setCurrentPage(1); // 현재 페이지를 첫 페이지로 이동
    setSelectedItems([]); // 체크박스 선택 데이터 초기화
    setText(""); // 검색 입력 텍스트박스 초기화
    setChoiceItemsPerPage(choiceItemoptions[0].slice(0, 2)); // 10개씩 보기 초기화 ,옵션의 1번째 항목으로 초기화함
    setListoptionsString(choiceItemoptions[0]); // 10개씩 보기 라벨 초기화
    setFiltertionsString(filterItemoptions[0]); // 정렬기준 라벨 초기화 ,옵션의 1번째 항목으로 초기화함
    setCheckedItems({}); // 체크박스 체크 초기화
  };

  // 첫 렌더링 useEffect
  useEffect(() => {
    // 컴포넌트가 마운트될 때 CSV 파일을 불러옵니다.
    fetch("/assets/data.csv") // CSV 파일을 경로에서 가져옵니다.
      .then((response) => response.text()) // 응답을 텍스트 형식으로 변환합니다.
      .then((csvText) => {
        // PapaParse 라이브러리를 사용하여 CSV 텍스트를 파싱합니다.
        Papa.parse(csvText, {
          header: true, // 첫 줄을 헤더로 사용합니다.
          skipEmptyLines: true, // 빈 줄은 무시합니다.
          complete: (results) => {
            setData(results.data); // 파싱된 데이터를 상태에 저장합니다.
            setSearchData(results.data);
            setSubData(results.data);
          },
        });
      })
      .catch((error) => console.error("Error fetching the CSV file:", error)); // 에러 처리
  }, []);

  //검색 useEffect
  useEffect(() => {
    if (text === "") {
      // 검색어가 비어있을 때는 전체 데이터를 표시합니다.
      setSearchData(data);
    } else {
      const searchText = text;
      const isHangulSearch = isHangul(searchText);

      let filtered = [];

      if (isHangulSearch) {
        // 올바른 한글 검색
        filtered = data.filter((item) =>
          Object.values(item).some((value) =>
            value.toString().includes(searchText)
          )
        );
      } else {
        // 초성 검색
        filtered = data.filter((item) =>
          Object.values(item).some((value) =>
            extractInitials(value.toString()).includes(searchText)
          )
        );
      }
      setSearchData(filtered);
      setSubData(filtered);
    }
  }, [text, data]);

  // 체크박스 useEffect
  useEffect(() => {
    if (selectedItems.length === 0) {
      setCurrentPage(1); // 현재 페이지를 첫 페이지로 이동
      setSearchData(subData); // 기존 검색 데이터로 돌려놓기
    } else {
      // 선택된 글자 길이 추출
      const selectedLengths = selectedItems.map((item) =>
        parseInt(item.replace("글자", ""), 10)
      );

      // 길이와 일치하는 데이터 필터링
      const filtered = subData.filter((row) => {
        // '캐릭터 이름' 필드의 값을 기준으로 필터링
        const value = row["캐릭터 이름"]; // '캐릭터 이름' 필드의 값을 가져옴
        return (
          typeof value === "string" && selectedLengths.includes(value.length)
        );
      });
      setSearchData(filtered);
      setCurrentPage(1); // 현재 페이지를 첫 페이지로 이동
    }
  }, [selectedItems, data, subData]); // data와 selectedItems이 변경될 때마다 실행

  // 렌더링
  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100 p-6">
      <div className="bg-white p-8 border rounded-lg shadow-lg w-full max-w-6xl min-h-screen">
        {/* 테이블 제목 */}
        <h1 className="text-2xl md:text-6xl font-bold mb-10 text-orange-600">
          뉴네임 옥션 닉네임찾기
        </h1>
        <div className="mb-4 flex gap-4">
          {/* 검색할 문자열 입력 */}
          <input
            className="flex-grow  text-xs md:text-base min-w-[0] py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-600"
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="검색어를 입력하세요 ex)히어로,ㅎㅇㄹ..."
          />
          <button
            onClick={entireHandleClick}
            className="py-2 px-4 bg-red-400 text-xs md:text-xl text-white rounded-lg hover:bg-red-600 hover:text-black"
          >
            초기화
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center my-4">
          {/* 체크박스 */}
          <div className="flex md:flex-[6] md:flex md:justify-center md:items-center justify-center items-center my-4">
            <Checkbox
              options={options}
              checkedItems={checkedItems}
              onChange={handleCheckboxChange}
            />
          </div>

          {/* 몇개씩 보기 드롭다운 */}
          <div className="flex md:flex-[5]">
            <div className="flex-[1] md:flex-[2] mx-2 my-2">
              <Dropdown label={listoptionsString + (!isMobile?" ⮟":"")}>
                {choiceItemoptions.map((item, idx) => (
                  <DropdownItem
                    key={idx}
                    onClick={() => handleChoiceItemClick(item)}
                  >
                    {item}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>

            {/* 정렬 필터링 드롭다운 */}
            <div className="flex-[1] md:flex-[3] mx-2 my-2">
              <Dropdown label={filteroptionsString + (!isMobile?" ⮟":"")}>
                {filterItemoptions.map((item, idx) => (
                  <DropdownItem
                    key={idx}
                    onClick={() => handleFilterItemClick(item, idx)}
                  >
                    {item}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-orange-300 rounded-lg shadow-md">
            <thead className="bg-orange-200 text-orange-600 ">
              <tr className="text-center font-bold">
                {/* 첫 번째 데이터 객체의 키를 사용하여 테이블 헤더를 렌더링합니다. */}
                {data[0] &&
                  Object.keys(data[0]).map((column) => (
                    <th
                      key={column}
                      className="text-xs md:text-xl py-2 px-2 md:px-4 border-b"
                    >
                      {column}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="text-sm md:text-lg">
              {currentItems.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-orange-50">
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 border-b">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이징 처리 */}
        <div className="mt-16">
          <Pagination
            totalItems={searchData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
        <p className="mt-16 text-gray-500">
          메이플 인벤 '음침개발자' 님 csv 파일 제공 감사합니다.
        </p>
      </div>
    </div>
  );
};

export default CsvDisplay;
