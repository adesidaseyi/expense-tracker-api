import { ApiProperty } from '@nestjs/swagger';

export class dataResponse {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Food',
  })
  name: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  createdAt: string;
}

export class GetCategoryResponses {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Request successful',
  })
  message: string;

  @ApiProperty({
    type: [dataResponse],
  })
  data: dataResponse;
}
