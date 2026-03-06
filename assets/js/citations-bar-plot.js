document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".scholar-citations-chart").forEach(chart => {

    const rawData = chart.dataset.citationsRaw
    const ewmaData = chart.dataset.citationsEwma

    if (!rawData || !ewmaData) {
      console.warn("Missing citation datasets")
      return
    }

    let raw
    let ewma

    try {
      raw = JSON.parse(rawData)
      ewma = JSON.parse(ewmaData)
    } catch (e) {
      console.error("Invalid citation JSON", e)
      return
    }

    const svg = chart.querySelector(".scholar-citations-svg")
    if (!svg) return

    // ---- sort years ----

    const years = Object.keys(raw).sort()
    const rawValues = years.map(y => raw[y])
    const ewmaValues = years.map(y => ewma[y])

    if (years.length === 0) return

    // ---- scale stabilization ----

    const rawMax = Math.max(...rawValues, ...ewmaValues)

    let max

    if (years.length === 1) {
      max = Math.max(rawMax * 2, 5)
    } else if (years.length <= 3) {
      max = Math.max(rawMax * 1.5, 6)
    } else {
      max = rawMax
    }

    // ---- layout ----

    const height = 100
    const marginTop = 12
    const marginBottom = 28
    const marginLeft = 14

    const chartHeight = height - marginBottom - marginTop

    // stable bar width
    const maxBarWidth = 26
    const barWidth = Math.min(maxBarWidth, Math.max(14, 180 / years.length))

    const chartWidth = barWidth * years.length + marginLeft + 20

    svg.setAttribute("viewBox", `0 0 ${chartWidth} ${height}`)

    // ---- baseline ----

    const axis = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    )

    axis.setAttribute("x1", marginLeft - 2)
    axis.setAttribute("x2", marginLeft + barWidth * years.length - barWidth * 0.4)
    axis.setAttribute("y1", height - marginBottom)
    axis.setAttribute("y2", height - marginBottom)
    axis.setAttribute("stroke", "#bbb")
    axis.setAttribute("stroke-width", "1")

    svg.appendChild(axis)

    // ---- draw bars ----

    years.forEach((year, i) => {

      const value = rawValues[i]
      const barHeight = (value / max) * chartHeight

      const x = marginLeft + i * barWidth
      const y = height - marginBottom - barHeight

      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      )

      rect.setAttribute("x", x)
      rect.setAttribute("y", y)
      rect.setAttribute("width", barWidth * 0.6)
      rect.setAttribute("height", barHeight)
      rect.setAttribute("rx", 2)

      svg.appendChild(rect)

      // value label

      const valueLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      )

      valueLabel.setAttribute("x", x + barWidth * 0.3)
      valueLabel.setAttribute("y", y - 3)
      valueLabel.setAttribute("text-anchor", "middle")

      valueLabel.textContent = value

      svg.appendChild(valueLabel)

    })

    // ---- trend line only if multiple years ----

    if (years.length > 1) {

      let path = ""

      ewmaValues.forEach((v, i) => {

        const x = marginLeft + i * barWidth + barWidth * 0.3
        const y = height - marginBottom - (v / max) * chartHeight

        if (i === 0) path += `M ${x} ${y}`
        else path += ` L ${x} ${y}`

      })

      const trend = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )

      trend.setAttribute("d", path)
      trend.setAttribute("fill", "none")
      trend.setAttribute("stroke", "#c43c35")
      trend.setAttribute("stroke-width", "2")

      svg.appendChild(trend)

      // markers

      ewmaValues.forEach((v, i) => {

        const x = marginLeft + i * barWidth + barWidth * 0.3
        const y = height - marginBottom - (v / max) * chartHeight

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        )

        circle.setAttribute("cx", x)
        circle.setAttribute("cy", y)
        circle.setAttribute("r", 2.4)

        svg.appendChild(circle)

      })

    }

    // ---- x-axis labels ----

    years.forEach((year, i) => {

      const x = marginLeft + i * barWidth + barWidth * 0.3
      const y = height - 8

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      )

      label.setAttribute("x", x)
      label.setAttribute("y", y)
      label.setAttribute("text-anchor", "middle")

      label.textContent = year

      svg.appendChild(label)

    })

  })

})