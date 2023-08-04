import mongo from 'mongoose';

const articleSchema = new mongo.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    editor: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    owner: { type: String, required: true }, // owner의 고유 ID (시스템 부여 ID)를 저장합니다.
    bookmark: { type: Boolean, default: 0 },
    shareConfig: {
        isShared: { type: Boolean, default: false },
        shareLevel: { type: String, default: 'private' },
        /**
         * shareLevel: 'private' | 'view' | 'edit'
         * private: only owner can see
         * view: anyone can see
         * edit: anyone can see and edit
         */
    },
    url: { type: String, required: true }, // /1jf82hjh4f와 같은 URL Param 형식으로 저장합니다.
    history: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        storedAt: { type: Date, default: Date.now }, // 기록이 저장된 시간
        editor: { type: String, required: true },
    }],

});

/**
 * 만일 로그인하지 않은 채로 수정했다면, IP 등등의 개인 정보를 수집한다.
 * 히스토리 표시 시 IP 등의 개인정보는 일부 마스킹 처리 후 표시한다.
 */

export default mongo.model('article', articleSchema);