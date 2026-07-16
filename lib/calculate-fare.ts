export function calculateVehicleFare(vehicle: Vehicle, distanceInKm: number): number {
  console.log("🚗 Vehicle:", vehicle);
  console.log("📏 Distance (km):", distanceInKm);

  const logs: string[] = [];
  const distanceInMiles = distanceInKm;

  const sortedSpots = [...vehicle.fareSpots].sort((a, b) => a.distance - b.distance);
  let totalFare = 0;
  let lastDistance = 0;

  for (let i = 0; i < sortedSpots.length; i++) {
    const current = sortedSpots[i];
    const bandStart = lastDistance;
    const bandEnd = current.distance;
    const rate = current.fareFactor;

    if (distanceInMiles > bandEnd) {
      const bandMiles = bandEnd - bandStart;
      const bandFare = bandMiles * rate;
      totalFare += bandFare;
      logs.push(
        `✅ Band ${bandStart}-${bandEnd} mi fully covered: ${bandMiles} × £${rate.toFixed(
          2
        )} = £${bandFare.toFixed(2)}`
      );
    } else if (distanceInMiles > bandStart) {
      const remaining = distanceInMiles - bandStart;
      const bandFare = remaining * rate;
      totalFare += bandFare;
      logs.push(
        `⚠️ Band ${bandStart}-${bandEnd} mi partially covered: ${remaining.toFixed(
          2
        )} × £${rate.toFixed(2)} = £${bandFare.toFixed(2)}`
      );
      lastDistance = distanceInMiles; // covered completely
      break;
    } else {
      logs.push(
        `⛔ Distance (${distanceInMiles.toFixed(2)} mi) does not reach band ${bandStart}-${bandEnd}.`
      );
      break;
    }

    lastDistance = bandEnd;
  }

  // 🆕 Handle remaining miles after last fare spot
  if (distanceInMiles > lastDistance) {
    const remaining = distanceInMiles - lastDistance;

    // ✅ use last fare factor if available, otherwise fallback to 1
    const lastRate = sortedSpots.length > 0 ? sortedSpots[sortedSpots.length - 1].fareFactor : 1;

    const bandFare = remaining * lastRate;
    totalFare += bandFare;
    logs.push(
      `➕ Beyond last band (${lastDistance}+ mi): ${remaining.toFixed(
        2
      )} × £${lastRate.toFixed(2)} = £${bandFare.toFixed(2)}`
    );
  }

  // ✅ Enforce minimum fare
  if (totalFare < vehicle.minFare) {
    logs.push(
      `❌ Total fare £${totalFare.toFixed(2)} is below minimum fare. Applying £${vehicle.minFare.toFixed(2)}.`
    );
    totalFare = vehicle.minFare;
  } else {
    logs.push(`✅ Total fare £${totalFare.toFixed(2)} meets/exceeds minimum fare.`);
  }

  console.log("🧾 Fare calculation logs:");
  logs.forEach((log) => console.log("   ", log));

  console.log("💰 Final Total Fare:", totalFare);

  return totalFare;
}
