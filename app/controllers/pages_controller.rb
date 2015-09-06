class PagesController < ApplicationController

	GOOGLE_BROWSER_API_KEY = 'AIzaSyCopWHWwD4ybUyhAumQ20bodU0AuaYM3_c'
	GOOGLE_SERVER_API_KEY = 'AIzaSyB22uhA_dJ3p07nbFXcgOOO6YNQqJnCkYI'
	EXPEDIA_API_KEY = 'nusNvdQtknZzmD0fHu42OTmv6IrMCAC7'
	# GRAPHHOPPER_API_KEY = 'cc4609d7-eee0-42ae-b36d-1eb5cb726c2e'
	GRAPHHOPPER_API_KEY = '5b46c734-0ec6-4da6-8c29-ada6a0270f63'

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

		url = URI.parse('http://terminal2.expedia.com/x/hotels?location='+destinationCoord[0].to_s+','+destinationCoord[1].to_s+'&radius=10km&dates='+params[:startDate]+','+params[:endDate]+'&maxhotels=10&sort=price&order=asc&apikey='+EXPEDIA_API_KEY)
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

		res = HTTParty.post('https://www.googleapis.com/qpxExpress/v1/trips/search?key='+GOOGLE_BROWSER_API_KEY, {body: JSON.dump(flightData), :headers => { 'Content-Type' => 'application/json', 'Accept' => 'application/json'} })

		# url = URI.parse('https://www.googleapis.com/qpxExpress/v1/trips/search?key='+GOOGLE_BROWSER_API_KEY)

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
			sort: 2,
			limit: 20
		}

		results = client.search(destination, params)

		render :json => results
	end


	def routes
		hotel = params[:hotel]
		points = params[:pois]

		# hotel = {'lat'=> 50.877044, 'lon'=> 12.076721}

		# points = [{'lat'=> 51.508742, 'lon'=> 7.500916, 'id'=> 'asdbfdbndvb'}, {'lat'=> 49.0047222, 'lon'=> 8.3858333, 'id'=> 'sfdfds'}]

		data = {
			"vehicles" => [{
				"vehicle_id" => "vehicle1",
				"start_address" => {
						"location_id" => "start",
						"lat"=> hotel["lat"],
						"lon"=> hotel["lon"]
				},
				"end_address" => {
					"location_id" => "end",
					"lat"=> hotel["lat"],
					"lon"=> hotel["lon"]
				},
				"type_id" => "vehicle_type_1",
				"return_to_depot" => true
			}],
			"vehicle_types" => [{
				"type_id" => "vehicle_type_1",
				"profile" => "car"
			}],
			"services" => []
		}

		points.each do |point|
			data["services"].push({
					"id"=> point[1]['index'].to_s,
					"name"=> "point_of_interest",
					"address"=> {
						"location_id"=> "loc",
						"lat"=> point[1]["lat"],
						"lon"=> point[1]["lon"]
					}
				})
		end


		job_id = HTTParty.post("https://graphhopper.com/api/1/vrp/optimize?key=#{GRAPHHOPPER_API_KEY}", {body: JSON.dump(data), :headers => { 'Content-Type' => 'application/json', 'Accept' => 'application/json'}, :verify => false })

		job_id = job_id['job_id']

		# Rails.logger.debug job_id

		# sleep(2)

		res = HTTParty.get("https://graphhopper.com/api/1/vrp/solution/#{job_id}?key=#{GRAPHHOPPER_API_KEY}", :verify => false)

		# `curl -X POST -H "Content-Type: application/json" "https://graphhopper.com/api/1/vrp/optimize?key=cc4609d7-eee0-42ae-b36d-1eb5cb726c2e" --data @../vrp.json`

		# sleep(2)

		# res = `curl -X GET "https://graphhopper.com/api/1/vrp/solution/#{job_id}?key=cc4609d7-eee0-42ae-b36d-1eb5cb726c2e"`

		Rails.logger.debug res

		# res = HTTParty.post('https://graphhopper.com/api/1/'+request+'&key='+GRAPHHOPPER_API_KEY)

		# url = URI.parse('https://graphhopper.com/api/1/'+request+'&key='+GRAPHHOPPER_API_KEY)
		# req = Net::HTTP::Post.new(url.to_s)
		# res = Net::HTTP.start(url.host, url.port) {|http| http.request(req) }



		# Store the order of point ids in `order`
		order = []
		res["solution"]["routes"][0]["activities"].each do |poi|
			order.push(poi["id"])
		end


		# Remove placeholders for hotel coords (start and end coord)
		# Remove first element
		order.shift
		# Remove last element
		order.pop

		render :json => order

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
