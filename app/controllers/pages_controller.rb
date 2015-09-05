class PagesController < ApplicationController

	def home
	end

	def choose
		gon.originCoord = Geocoder.coordinates(params[:origin])
		gon.destCoord = Geocoder.coordinates(params[:destination])
		gon.origin = params[:origin]
		gon.destination = params[:destination]
		gon.startdate = params[:startdate]
		gon.enddate = params[:enddate]
	end

end
