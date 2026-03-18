type WalkerModelClassSourceData = { 
  image: HTMLImageElement 
  rect: Array<number>
} | undefined | null


export class WalkerModel {
  image?: HTMLImageElement
  x: number = 0
  y: number = 0
  anchorY: number = 0
  scaleX: number = 1
  walk: any = null
  rect: Array<number> = []
  width: number = 0
  height: number = 0
  drawArgs: Array<HTMLImageElement | number | undefined> = []

  constructor(sourceData: WalkerModelClassSourceData) {
    if (sourceData) {
      const {image, rect} = sourceData
      this.image = image
      this.setRect(rect)
    }
  }
    setRect (rect: Array<number>) {
      this.rect = rect
      this.width = rect[2]
      this.height = rect[3]
      this.drawArgs = [
        this.image,
        ...rect,
        0,
        0,
        this.width,
        this.height,
      ]  
    }
    
    render (ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.scale(this.scaleX, 1)
      // @ts-ignore
      ctx.drawImage(...this.drawArgs)
      ctx.restore()
    }
  }
  