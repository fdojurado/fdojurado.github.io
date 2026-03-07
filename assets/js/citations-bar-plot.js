document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".scholar-citations-chart").forEach(chart => {

    const rawData = chart.dataset.citationsRaw
    const ewmaData = chart.dataset.citationsEwma
    if (!rawData || !ewmaData) return

    let raw, ewma
    try { raw = JSON.parse(rawData); ewma = JSON.parse(ewmaData) } catch { return }

    const svg = chart.querySelector(".scholar-citations-svg")
    if (!svg) return

    const years = Object.keys(raw).sort()
    const rawValues = years.map(y => raw[y])
    const ewmaValues = years.map(y => ewma[y])
    if (years.length === 0) return

    // ---- dynamic max scaling ----
    let rawMax = Math.max(...rawValues, ...ewmaValues)
    // If rawMax is tiny, increase it slightly to avoid tiny bars
    let max = rawMax < 5 ? 5 : rawMax * 1.1

    const height = 110
    const marginTop = 2      // minimal space above value label
    const marginBottom = 28  // space for x-axis labels
    const chartHeight = height - marginTop - marginBottom

    const maxBarWidth = 26
    const barWidth = Math.min(maxBarWidth, Math.max(14, 180 / years.length))
    const chartWidth = barWidth * years.length

    svg.setAttribute("viewBox", `0 0 ${chartWidth} ${height}`)
    svg.setAttribute("width", chartWidth)
    svg.setAttribute("height", height)

    // ---- baseline ----
    const axis = document.createElementNS("http://www.w3.org/2000/svg", "line")
    axis.setAttribute("x1", 0)
    axis.setAttribute("x2", chartWidth)
    axis.setAttribute("y1", height - marginBottom)
    axis.setAttribute("y2", height - marginBottom)
    axis.setAttribute("stroke", "#bbb")
    axis.setAttribute("stroke-width", "1")
    svg.appendChild(axis)

    // ---- draw bars ----
    years.forEach((year, i) => {
      const value = rawValues[i]
      const barHeight = (value / max) * chartHeight
      const x = i * barWidth
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
      valueLabel.setAttribute("y", y - 2)
      valueLabel.setAttribute("text-anchor", "middle")
      valueLabel.setAttribute("class", "scholar-citations-value")
      valueLabel.textContent = value
      svg.appendChild(valueLabel)
    })

    // ---- trend line ----
    if (years.length > 1) {
      let path = ""
      ewmaValues.forEach((v, i) => {
        const x = i * barWidth + barWidth * 0.3
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
        const x = i * barWidth + barWidth * 0.3
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
      const x = i * barWidth + barWidth * 0.3
      const y = height - 4
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
      label.setAttribute("x", x)
      label.setAttribute("y", y)
      label.setAttribute("text-anchor", "middle")
      label.textContent = year
      svg.appendChild(label)
    })

  })
})