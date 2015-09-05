class PagesController < ApplicationController

	def home
	end

	def choose
		gon.origin = Geocoder.coordinates(params[:origin])
		gon.destination = Geocoder.coordinates(params[:destination])
		gon.startdate = params[:startdate]
		gon.enddate = params[:enddate]
	end

end
