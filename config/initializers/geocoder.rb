	GOOGLE_SERVER_API_KEY = 'AIzaSyB22uhA_dJ3p07nbFXcgOOO6YNQqJnCkYI'


	Geocoder.configure(
		:timeout => 2,
		:use_https => true,

		:google => {
			:api_key => GOOGLE_SERVER_API_KEY,
			:timeout => 5
		}

		)