document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".scholar-citations-chart").forEach(chart => {

    const rawData = chart.dataset.citationsRaw
    const ewmaData = chart.dataset.citationsEwma
    if (!rawData || !ewmaData) return

    let raw, ewma
    try {
      raw = JSON.parse(rawData)
      ewma = JSON.parse(ewmaData)
    } catch { return }

    const svg = chart.querySelector(".scholar-citations-svg")
    if (!svg) return

    const years = Object.keys(raw).sort()
    const rawValues = years.map(y => raw[y])
    const ewmaValues = years.map(y => ewma[y])
    if (years.length === 0) return

    const rawMax = Math.max(...rawValues, ...ewmaValues)
    let max = (years.length === 1 ? Math.max(rawMax * 2, 5) :
      years.length <= 3 ? Math.max(rawMax * 1.5, 6) :
        rawMax)

    const height = 100
    const marginTop = 12
    const marginBottom = 28
    const extraMargin = 6  // small extra margin so x labels are visible
    const chartHeight = height - marginTop - marginBottom

    const maxBarWidth = 26
    const barWidth = Math.min(maxBarWidth, Math.max(14, 180 / years.length))

    const chartWidth = barWidth * years.length + extraMargin * 2
    svg.setAttribute("viewBox", `0 0 ${chartWidth} ${height}`)
    svg.setAttribute("width", chartWidth)
    svg.setAttribute("height", height)

    // ---- baseline ----
    const axis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    axis.setAttribute("x1", extraMargin)
    axis.setAttribute("x2", extraMargin + barWidth * years.length)
    axis.setAttribute("y1", height - marginBottom)
    axis.setAttribute("y2", height - marginBottom)
    axis.setAttribute("stroke", "#bbb")
    axis.setAttribute("stroke-width", "1")
    svg.appendChild(axis)

    // ---- draw bars and values ----
    years.forEach((year, i) => {
      const value = rawValues[i]
      const barHeight = (value / max) * chartHeight
      const x = extraMargin + i * barWidth
      const y = height - marginBottom - barHeight

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("x", x)
      rect.setAttribute("y", y)
      rect.setAttribute("width", barWidth * 0.6)
      rect.setAttribute("height", barHeight)
      rect.setAttribute("rx", 2)
      svg.appendChild(rect)

      const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
      valueLabel.setAttribute("x", x + barWidth * 0.3)
      valueLabel.setAttribute("y", y - 4)
      valueLabel.setAttribute("text-anchor", "middle")
      valueLabel.setAttribute("class", "scholar-citations-value")
      valueLabel.textContent = value
      svg.appendChild(valueLabel)
    })

    // ---- trend line and EWMA points ----
    if (years.length > 1) {
      let path = ""
      ewmaValues.forEach((v, i) => {
        const x = extraMargin + i * barWidth + barWidth * 0.3
        const y = height - marginBottom - (v / max) * chartHeight
        path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
      })

      const trend = document.createElementNS("http://www.w3.org/2000/svg", "path")
      trend.setAttribute("d", path)
      trend.setAttribute("fill", "none")
      trend.setAttribute("stroke", "#c43c35")
      trend.setAttribute("stroke-width", "2")
      svg.appendChild(trend)

      ewmaValues.forEach((v, i) => {
        const x = extraMargin + i * barWidth + barWidth * 0.3
        const y = height - marginBottom - (v / max) * chartHeight
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circle.setAttribute("cx", x)
        circle.setAttribute("cy", y)
        circle.setAttribute("r", 2.4)
        svg.appendChild(circle)
      })
    }

    // ---- x-axis labels ----
    years.forEach((year, i) => {
      const x = extraMargin + i * barWidth + barWidth * 0.3
      const y = height - 8
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", x)
      label.setAttribute("y", y)
      label.setAttribute("text-anchor", "middle")
      label.textContent = year
      svg.appendChild(label)
    })

  })

})