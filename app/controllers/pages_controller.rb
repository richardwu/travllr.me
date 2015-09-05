class PagesController < ApplicationController

	def home
	end

	def choose

		params[:origin] = "Toronto, ON, Canada"
		params[:destination] = "Boston, MA, United States"
		params[:startdate] = "2015-09-20"
		params[:enddate] = "2015-09-25"


		origin = params[:origin].split(', ').join(',')
		destination = params[:destination].split(', ').join(',')

		gon.originCode = findCode(origin)
		gon.destinationCode = findCode(destination)

		gon.originCoord = Geocoder.coordinates(params[:origin])
		gon.destinationCoord = Geocoder.coordinates(params[:destination])

		gon.origin = params[:origin]
		gon.destination = params[:destination]
		gon.startdate = params[:startdate]
		gon.enddate = params[:enddate]


		# Retrieve hotels

		url = URI.parse('http://terminal2.expedia.com/x/hotels?location='+gon.destinationCoord[0].to_s+','+gon.destinationCoord[1].to_s+'&radius=5km&dates='+gon.startdate+','+gon.enddate+'&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7')
		req = Net::HTTP::Get.new(url.to_s)
		res = Net::HTTP.start(url.host, url.port) {|http| http.request(req) }
		gon.hotels = JSON.parse(res.body)

	end

	private 
	def findCode(place)
		place = place.split(', ').join(',')

		url = URI.parse('http://terminal2.expedia.com/x/suggestions/regions?query='+place+'&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7')
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
