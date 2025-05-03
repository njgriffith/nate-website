import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  weatherCodes: any = {
    "0": "Unknown",
    "1000": "Clear",
    "1100": "Mostly Clear",
    "1101": "Partly Cloudy",
    "1102": "Mostly Cloudy",
    "1001": "Cloudy",
    "2000": "Fog",
    "2100": "Light Fog",
    "4000": "Drizzle",
    "4200": "Light Rain",
    "4001": "Rain",
    "4201": "Heavy Rain",
    "5000": "Snow",
    "5001": "Flurries",
    "5100": "Light Snow",
    "5101": "Heavy Snow",
    "6000": "Freezing Drizzle",
    "6001": "Freezing Rain",
    "6200": "Light Freezing Rain",
    "6201": "Heavy Freezing Rain",
    "7000": "Ice Pellets",
    "7101": "Heavy Ice Pellets",
    "7102": "Light Ice Pellets",
    "8000": "Thunderstorm"
  }
  weatherData: any = {}
  weatherIcon: string = '';
  windDirection: string = '';

  constructor(private apiService: ApiService) { }
  ngOnInit() {
    this.apiService.getWeather().subscribe({
      next: (response) => {
        if (response.type === 'Too Many Calls') return;
        let keys = Object.keys(response['data']['values']);
        let values = Object.values(response['data']['values']);
        keys.forEach((key: string, index: number) => {
          this.weatherData[key] = values[index]
        });
        this.weatherData.location = response['location']['name'];
        this.handleWeatherIcon();
        this.windDirection = this.handleWindDirection(this.weatherData.windDirection);
      },
      error: (error) => {
        console.error("error fetching weather", error);
      }
    });
  }


  handleWindDirection(direction: number) {
    var windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const increment = 22.5;
    var start = 348.75;
    for (let i = 0; i < 16; i++) {
      if (start < direction && direction < (start + increment % 360)) {
        return windDirections[i];
      }
      start = (start + increment) % 360;
    }
    return 'N';
  }

  handleWeatherIcon() {
    var iconName = this.weatherCodes[this.weatherData['weatherCode']];
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    const codesForNight = [1000, 1100, 1101, 1102];
    if (isNight && codesForNight.includes(this.weatherData['weatherCode'])) {
      iconName += ' Night';
    }
    this.weatherIcon = `assets/weather/${iconName}.png`;
  }
}
