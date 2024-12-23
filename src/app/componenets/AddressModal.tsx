import React from "react";
import ReactDOM from "react-dom";
import DaumPostcode from "react-daum-postcode";

interface AddressModalProps {
    open: boolean; // 모달 열림 여부
    onClose: () => void; // 모달 닫기 함수
    onAddressSelect: (address: string) => void; // 선택된 주소를 부모 컴포넌트로 전달하는 함수
}

const AddressModal = ({ open, onClose, onAddressSelect }: AddressModalProps) => {
    if (!open) return null; // 모달이 닫혀 있으면 아무것도 렌더링하지 않음

    const handleComplete = (data: any) => {
        // DaumPostcode에서 반환된 데이터를 처리
        onAddressSelect(data.address); // 주소를 부모 컴포넌트로 전달
        onClose(); // 모달 닫기
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    닫기
                </button>
                <DaumPostcode onComplete={handleComplete} style={{ width: "100%", height: "450px" }} />
            </div>
        </div>,
        document.getElementById("global-modal") as HTMLElement
    );
};

export default AddressModal;
