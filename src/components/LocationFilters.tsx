import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCrowdStore } from "@/store/crowdStore";
import { getUniqueCities } from "@/data/seedData";
import { cn } from "@/lib/utils";

export function LocationFilters() {
  const { selectedCity, searchQuery, setSelectedCity, setSearchQuery } = useCrowdStore();
  const cities = getUniqueCities();
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search locations, cities, or types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* City Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCity === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCity(null)}
          className={cn(
            "gap-1.5",
            selectedCity === null && "bg-primary text-primary-foreground"
          )}
        >
          <MapPin className="w-3 h-3" />
          All Cities
        </Button>
        
        {cities.map((city) => (
          <Button
            key={city}
            variant={selectedCity === city ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCity(city)}
            className={cn(
              selectedCity === city && "bg-primary text-primary-foreground"
            )}
          >
            {city}
          </Button>
        ))}
      </div>
      
      {/* Active Filters */}
      {(selectedCity || searchQuery) && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {selectedCity && (
            <Badge variant="secondary" className="gap-1">
              {selectedCity}
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => setSelectedCity(null)}
              />
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              "{searchQuery}"
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => setSearchQuery("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
