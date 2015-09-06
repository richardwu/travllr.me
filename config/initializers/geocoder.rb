	GOOGLE_SERVER_API_KEY = 'AIzaSyB22uhA_dJ3p07nbFXcgOOO6YNQqJnCkYI'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

	Geocoder.configure(
		:timeout => 2,
		:use_https => true,

		:google => {
			:api_key => GOOGLE_SERVER_API_KEY,
			:timeout => 5
		}

		)
