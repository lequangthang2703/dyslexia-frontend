export interface Account {
	id: number;
	email: string;
	created_at: string;
	role: string;
	profiles: Profile[];
}

export interface Profile {
	id: number;
	account_id: number;
	profile_type: string;
	created_at: string;
	name?: string;
	year_of_birth?: number;
	email?: string;
	mother_tongue?: string;
	gender?: string;
	official_dyslexia_diagnosis?: string;
}

export interface CreateProfileData {
	profile_type: string;
	name: string;
}

/**
 * {
    "id": 2,
    "email": "user@example.com",
    "created_at": "2025-10-03T12:35:25.351754Z",
    "role": "ADMIN",
    "profiles": [
        {
            "id": 1,
            "account_id": 2,
            "profile_type": "PARENT",
            "created_at": "2025-10-03T12:35:25.351754Z",
            "name": "string",
            "year_of_birth": 1900,
            "email": "user@example.com",
            "mother_tongue": "string",
            "gender": "MALE",
            "official_dyslexia_diagnosis": "YES"
        }
    ]
}
 */
