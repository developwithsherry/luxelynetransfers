<div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              {/* Search Bar */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  {step === "pickup" ? (
                    <Input
                      id="pickup-input"
                      type="text"
                      placeholder="Enter pickup location..."
                      value={bookingDetails.pickup.address}
                      onChange={(e) => {
                        updateBookingDetails({
                          pickup: { ...bookingDetails.pickup, address: e.target.value },
                        })
                        setSearchQuery(e.target.value)
                      }}
                      onKeyPress={handleKeyPress}
                      className="h-14 text-lg pl-12 pr-4 border-gray-300 focus:border-lime-300 focus:ring-lime-300"
                    />
                  ) : step === "dropoff" ? (
                    <Input
                      id="dropoff-input"
                      type="text"
                      placeholder="Enter destination..."
                      value={bookingDetails.dropoff.address}
                      onChange={(e) => {
                        updateBookingDetails({
                          dropoff: { ...bookingDetails.dropoff, address: e.target.value },
                        })
                        setSearchQuery(e.target.value)
                      }}
                      onKeyPress={handleKeyPress}
                      className="h-14 text-lg pl-12 pr-4 border-gray-300 focus:border-lime-500 focus:ring-lime-300"
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder="Where would you like to go?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-14 text-lg pl-12 pr-4 border-gray-300 focus:border-lime-300 focus:ring-lime-500"
                    />
                  )}
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <Button
                  size={"sm"}
                  onClick={handleNext}
                  className="h-14 px-8 bg-accent hover:bg-lime-400 text-white rounded-xl"
                >
                  {step === "summary" ? <ArrowRight className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </Button>
              </div>

              {/* Current Booking Values */}
              {renderCurrentValues().length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center mb-4">
                  {renderCurrentValues().map((value, index) => (
                    <div key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {value}
                    </div>
                  ))}
                </div>
              )}

              {/* Step-specific Content */}
              {step === "stops" && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Add stops (optional)</h3>
                      <Button onClick={addStop} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Stop
                      </Button>
                    </div>
                    {bookingDetails.stops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-2 mb-2">
                        <div className="relative flex-1">
                          <Input
                            id={`stop-${stop.id}`}
                            placeholder={`Stop ${index + 1}`}
                            value={stop.address}
                            onChange={(e) => updateStopAddress(stop.id, e.target.value)}
                            className="pl-10"
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <Button onClick={() => removeStop(stop.id)} variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {step === "datetime" && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Switch
                        id="with-return"
                        checked={bookingDetails.withReturn}
                        onCheckedChange={(checked) => updateBookingDetails({ withReturn: checked })}
                      />
                      <Label htmlFor="with-return" className="font-medium">
                        Round Trip
                      </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block mb-2">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !bookingDetails.date && "text-muted-foreground",
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {bookingDetails.date ? (
                                formatDateUK(format(bookingDetails.date, "yyyy-MM-dd"))
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={bookingDetails.date}
                              onSelect={(date) => date && updateBookingDetails({ date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="block mb-2">Time</Label>
                        <Select value={bookingDetails.time} onValueChange={(time) => updateBookingDetails({ time })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {bookingDetails.time}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {timeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "return" && bookingDetails.withReturn && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Return Trip Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block mb-2">Return Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !bookingDetails.returnDate && "text-muted-foreground",
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {bookingDetails.returnDate ? (
                                formatDateUK(format(bookingDetails.returnDate, "yyyy-MM-dd"))
                              ) : (
                                <span>Pick return date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={bookingDetails.returnDate}
                              onSelect={(date) => date && updateBookingDetails({ returnDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="block mb-2">Return Time</Label>
                        <Select
                          value={bookingDetails.returnTime}
                          onValueChange={(returnTime) => updateBookingDetails({ returnTime })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select return time">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {bookingDetails.returnTime}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {returnTimeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "summary" && (
                <div className="text-center">
                  <Button
                    onClick={handleBookNow}
                    disabled={isCalculating}
                    className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800"
                  >
                    {isCalculating ? "Processing..." : "BOOK NOW →"}
                  </Button>
                </div>
              )}

              {/* Step Indicator */}
              {step !== "search" && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Step{" "}
                    {step === "pickup"
                      ? "1"
                      : step === "dropoff"
                        ? "2"
                        : step === "stops"
                          ? "3"
                          : step === "datetime"
                            ? "4"
                            : step === "return"
                              ? "5"
                              : "6"}{" "}
                    of {bookingDetails.withReturn ? "6" : "5"}
                  </div>
                </div>
              )}
            </div>
          </div>