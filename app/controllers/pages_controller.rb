class PagesController < ApplicationController

	QPX_API_KEY = 'AIzaSyCopWHWwD4ybUyhAumQ20bodU0AuaYM3_c'
	EXPEDIA_API_KEY = 'nusNvdQtknZzmD0fHu42OTmv6IrMCAC7'

	YELP_CONSUMER_KEY = 'cuWb6xBDPQLPeJ9KO-o68w'
	YELP_CONSUMER_SECRET = 'FFg02nebpgPFChpKW_b4k_3EYXo'
	YELP_TOKEN = 'YDYvgF7njoGo5fTFNF_fvignlO9K7uCI'
	YELP_TOKEN_SECRET = 'Pe7lQAGy5KLPkpcr3oFGDrZPBZE'

	def home
	end


	def hotels
		# params[:origin] = "Toronto, ON, Canada"
		# params[:destination] = "Boston, MA, United States"
		# params[:startDate] = "2015-09-20"
		# params[:endDate] = "2015-09-25"

		# originCoord = Geocoder.coordinates(params[:origin])
		destinationCoord = Geocoder.coordinates(params[:destination])

		url = URI.parse('http://terminal2.expedia.com/x/hotels?location='+destinationCoord[0].to_s+','+destinationCoord[1].to_s+'&radius=5km&dates='+params[:startDate]+','+params[:endDate]+'&apikey='+EXPEDIA_API_KEY)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port) {|http| http.request(req) }
		hotels = JSON.parse(res.body)

		render :json => hotels
	end

	def flights

		# params[:origin] = "Toronto, ON, Canada"
		# params[:destination] = "Boston, MA, United States"
		# params[:startDate] = "2015-09-20"
		# params[:endDate] = "2015-09-25"

		originCode = findCode(params[:origin])
		destinationCode = findCode(params[:destination])

		flightData = {
			"request": {
				"passengers": {
					"adultCount": 1
				},
				"slice": [
					{
						"origin": originCode,
						"destination": destinationCode,
						"date": params[:startDate]
					},
					{
						"origin": destinationCode,
						"destination": originCode,
						"date": params[:endDate]
					}
				],
				"solutions": 10
			}
		}

		res = HTTParty.post('https://www.googleapis.com/qpxExpress/v1/trips/search?key='+QPX_API_KEY, {body: JSON.dump(flightData), :headers => { 'Content-Type' => 'application/json', 'Accept' => 'application/json'} })

		# url = URI.parse('https://www.googleapis.com/qpxExpress/v1/trips/search?key='+QPX_API_KEY)

		# req = Net::HTTP::Post.new(url, initheader = {'Content-Type' =>'application/json'})
		# req.body = '{"request":{"passengers":{"adultCount":1},"slice":[{"origin":"YYZ","destination":"BOS","date":"2015-09-10"},{"origin":"BOS","destination":"YYZ","date":"2015-09-16"}],"solutions":10}}'
		# res = Net::HTTP.start(url.host, url.port) do |http|
		# 	http.request(req)
		# end

		render :json => res.body

	end 

	def activities

		destination = params[:destination].split(', ').join(',')
		client = Yelp::Client.new({ consumer_key: YELP_CONSUMER_KEY,
                            consumer_secret: YELP_CONSUMER_SECRET,
                            token: YELP_TOKEN,
                            token_secret: YELP_TOKEN_SECRET
                          })

		params = {
			term: 'landmarks',
			limit: 20
		}

		results = client.search(destination, params)

		render :json => results
	end

	def choose

		params[:origin] = "Toronto, ON, Canada"
		params[:destination] = "Boston, MA, United States"
		params[:startDate] = "2015-09-20"
		params[:endDate] = "2015-09-25"


		origin = params[:origin].split(', ').join(',')
		destination = params[:destination].split(', ').join(',')

		gon.originCode = findCode(origin)
		gon.destinationCode = findCode(destination)

		gon.originCoord = Geocoder.coordinates(params[:origin])
		gon.destinationCoord = Geocoder.coordinates(params[:destination])

		gon.origin = params[:origin]
		gon.destination = params[:destination]
		gon.startDate = params[:startDate]
		gon.endDate = params[:endDate]


		# Retrieve hotels

		url = URI.parse('http://terminal2.expedia.com/x/hotels?location='+gon.destinationCoord[0].to_s+','+gon.destinationCoord[1].to_s+'&radius=5km&dates='+gon.startDate+','+gon.endDate+'&apikey='+EXPEDIA_API_KEY)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port) {|http| http.request(req) }
		gon.hotels = JSON.parse(res.body)

	end

	private 
	def findCode(place)
		place = place.split(', ').join(',')

		url = URI.parse('http://terminal2.expedia.com/x/suggestions/regions?query='+place+'&apikey='+EXPEDIA_API_KEY)
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port) {|http| http.request(req) }

		placeJson = JSON.parse(res.body)

		code = '';
		placeJson['sr'].each do |result|
			if result['t'] == 'AIRPORT'
				code = result['a']
				break
			end
		end

		if code.blank?
			code = placeJson['sr'].first['a']
		end

		return code
	end

end
